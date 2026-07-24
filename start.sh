#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[[ -f "$ROOT/.env" ]] || { echo "Missing .env; copy .env.example." >&2; exit 1; }
set -a
source "$ROOT/.env"
set +a
frontend_port="${FRONTEND_PORT:-3000}"
export ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-http://127.0.0.1:$frontend_port}"
case "${1:-start}" in
  start)
    (cd "$ROOT/backend" && exec npm start) & backend_pid=$!
    (cd "$ROOT/frontend" && exec npm run dev -- --host 127.0.0.1 --port "$frontend_port") & frontend_pid=$!
    cleanup(){ trap - EXIT INT TERM; kill "$backend_pid" "$frontend_pid" 2>/dev/null || true; wait "$backend_pid" "$frontend_pid" 2>/dev/null || true; }
    trap cleanup EXIT INT TERM
    wait "$backend_pid" "$frontend_pid"
    ;;
  backend) cd "$ROOT/backend"; exec npm start;;
  frontend) cd "$ROOT/frontend"; exec npm run dev -- --host 127.0.0.1 --port "$frontend_port";;
  *) echo "Usage: $0 [start|backend|frontend]" >&2; exit 64;;
esac
