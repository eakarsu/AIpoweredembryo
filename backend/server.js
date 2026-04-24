const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/cycles', require('./routes/cycles'));
app.use('/api/embryos', require('./routes/embryos'));
app.use('/api/ai-scores', require('./routes/ai-scores'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/lab-results', require('./routes/lab-results'));
app.use('/api/genetic-screenings', require('./routes/genetic-screenings'));
app.use('/api/transfer-plans', require('./routes/transfer-plans'));
app.use('/api/quality-control', require('./routes/quality-control'));
app.use('/api/ai-reports', require('./routes/ai-reports'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});
