#!/bin/bash

# =============================================================
# EmbryoAI Pro - IVF Embryo Selection Platform
# Start Script - Cleans ports, seeds data, starts with hot reload
# =============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}"
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║         EmbryoAI Pro - IVF Platform          ║"
echo "  ║    AI-Powered Embryo Selection System         ║"
echo "  ╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# ---- Clean up used ports ----
echo -e "${YELLOW}[1/6] Cleaning up ports 3000 and 4000...${NC}"

# Kill any process on port 3000
for PID in $(lsof -ti:3000 2>/dev/null); do
  kill -9 "$PID" 2>/dev/null || true
  echo -e "  Killed PID $PID on port 3000"
done

# Kill any process on port 4000 (multiple attempts)
for PID in $(lsof -ti:4000 2>/dev/null); do
  kill -9 "$PID" 2>/dev/null || true
  echo -e "  Killed PID $PID on port 4000"
done

# Also kill any leftover node/nodemon processes from previous runs
pkill -f "nodemon server.js" 2>/dev/null || true
pkill -f "node server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait and verify ports are free
sleep 2

# Double-check port 4000 is truly free
if lsof -ti:4000 >/dev/null 2>&1; then
  echo -e "${RED}  Port 4000 still in use, force killing...${NC}"
  lsof -ti:4000 | xargs kill -9 2>/dev/null || true
  sleep 2
fi

if lsof -ti:3000 >/dev/null 2>&1; then
  echo -e "${RED}  Port 3000 still in use, force killing...${NC}"
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
  sleep 2
fi

echo -e "${GREEN}  Ports cleaned.${NC}"

# ---- Check PostgreSQL ----
echo -e "${YELLOW}[2/6] Checking PostgreSQL...${NC}"
if ! pg_isready -q 2>/dev/null; then
  echo -e "${RED}  PostgreSQL is not running. Starting it...${NC}"
  brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || {
    echo -e "${RED}  Failed to start PostgreSQL. Please start it manually.${NC}"
    exit 1
  }
  sleep 2
fi
echo -e "${GREEN}  PostgreSQL is running.${NC}"

# ---- Create database ----
echo -e "${YELLOW}[3/6] Setting up database...${NC}"
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'ivf_embryo_db'" 2>/dev/null | grep -q 1 || \
  createdb -U postgres ivf_embryo_db 2>/dev/null || \
  psql postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'ivf_embryo_db'" | grep -q 1 || \
  createdb ivf_embryo_db 2>/dev/null || true
echo -e "${GREEN}  Database ready.${NC}"

# ---- Install dependencies ----
echo -e "${YELLOW}[4/6] Installing dependencies...${NC}"
cd "$SCRIPT_DIR/backend" && npm install --silent 2>&1 | tail -1
cd "$SCRIPT_DIR/frontend" && npm install --silent 2>&1 | tail -1
echo -e "${GREEN}  Dependencies installed.${NC}"

# ---- Seed database ----
echo -e "${YELLOW}[5/6] Seeding database with sample data...${NC}"
cd "$SCRIPT_DIR/backend"

# Try with postgres user first, then without
export DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/ivf_embryo_db}"

# Attempt seeding - try different DB connection methods
node seeds/seed.js 2>&1 || {
  echo -e "${YELLOW}  Trying alternative DB connection...${NC}"
  export DATABASE_URL="postgresql://localhost:5432/ivf_embryo_db"
  # Update .env for alternative connection
  sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://localhost:5432/ivf_embryo_db|" "$SCRIPT_DIR/.env" 2>/dev/null || true
  node seeds/seed.js 2>&1 || {
    echo -e "${YELLOW}  Trying with current user...${NC}"
    export DATABASE_URL="postgresql://$(whoami)@localhost:5432/ivf_embryo_db"
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$(whoami)@localhost:5432/ivf_embryo_db|" "$SCRIPT_DIR/.env" 2>/dev/null || true
    node seeds/seed.js 2>&1
  }
}
echo -e "${GREEN}  Database seeded successfully!${NC}"

# ---- Start services with hot reload ----
echo -e "${YELLOW}[6/6] Starting services with hot reload...${NC}"

# Start backend with nodemon (watches for changes)
cd "$SCRIPT_DIR/backend"
npx nodemon server.js &
BACKEND_PID=$!

# Start frontend with Vite (built-in HMR)
cd "$SCRIPT_DIR/frontend"
npx vite --host &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}  ╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}  ║  EmbryoAI Pro is running!                    ║${NC}"
echo -e "${GREEN}  ║                                              ║${NC}"
echo -e "${GREEN}  ║  Frontend: ${BLUE}http://localhost:3000${GREEN}              ║${NC}"
echo -e "${GREEN}  ║  Backend:  ${BLUE}http://localhost:4000${GREEN}              ║${NC}"
echo -e "${GREEN}  ║                                              ║${NC}"
echo -e "${GREEN}  ║  Demo Login:                                 ║${NC}"
echo -e "${GREEN}  ║  Email: admin@ivfclinic.com                  ║${NC}"
echo -e "${GREEN}  ║  Password: admin123                          ║${NC}"
echo -e "${GREEN}  ║                                              ║${NC}"
echo -e "${GREEN}  ║  Hot reload enabled - changes auto-refresh   ║${NC}"
echo -e "${GREEN}  ║  Press Ctrl+C to stop all services           ║${NC}"
echo -e "${GREEN}  ╚══════════════════════════════════════════════╝${NC}"
echo ""

# Handle cleanup on exit
cleanup() {
  echo -e "\n${YELLOW}Shutting down EmbryoAI Pro...${NC}"
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null || true
  lsof -ti:4000 2>/dev/null | xargs kill -9 2>/dev/null || true
  echo -e "${GREEN}All services stopped.${NC}"
  exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
