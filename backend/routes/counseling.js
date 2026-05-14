// Genetic counseling workflow — Apply pass 5 (NEEDS-PRODUCT-DECISION).
//
// PRODUCT-DECISION: the audit asks for a "genetic counseling documentation
// workflow". Pick a reasonable default schema:
//   - sessions: scheduled counseling sessions (datetime, counselor_id, patient_id)
//   - notes: structured counselor notes (presession, in-session, post)
//   - sign_offs: counselor sign-off + secondary review (board-certified
//     genetic counselor required by ACMG guidance)
//
// We only persist additive tables here — clinical sign-off binding to the
// downstream order workflow needs a clinic-by-clinic policy decision and is
// out of scope for this pass.
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sequelize = require('../config/database');

async function ensureTables() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS counseling_sessions (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER,
      counselor_id INTEGER,
      session_type VARCHAR(32),
      scheduled_at TIMESTAMP,
      status VARCHAR(32) DEFAULT 'scheduled',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `).catch(() => {});
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS counseling_notes (
      id SERIAL PRIMARY KEY,
      session_id INTEGER,
      phase VARCHAR(16),
      author_id INTEGER,
      body TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `).catch(() => {});
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS counseling_sign_offs (
      id SERIAL PRIMARY KEY,
      session_id INTEGER,
      signer_id INTEGER,
      role VARCHAR(32),
      signed_at TIMESTAMP DEFAULT NOW()
    )
  `).catch(() => {});
}

router.get('/sessions', auth, async (req, res) => {
  try {
    await ensureTables();
    const [rows] = await sequelize.query(`SELECT * FROM counseling_sessions ORDER BY scheduled_at DESC LIMIT 200`);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/sessions', auth, async (req, res) => {
  try {
    await ensureTables();
    const { patient_id, counselor_id, session_type, scheduled_at } = req.body || {};
    const [rows] = await sequelize.query(
      `INSERT INTO counseling_sessions (patient_id, counselor_id, session_type, scheduled_at)
       VALUES (:patient_id, :counselor_id, :session_type, :scheduled_at) RETURNING *`,
      { replacements: { patient_id: patient_id || null, counselor_id: counselor_id || null, session_type: session_type || 'pre-test', scheduled_at: scheduled_at || null } }
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/sessions/:id/notes', auth, async (req, res) => {
  try {
    await ensureTables();
    const { phase, body } = req.body || {};
    const [rows] = await sequelize.query(
      `INSERT INTO counseling_notes (session_id, phase, author_id, body) VALUES (:s, :p, :a, :b) RETURNING *`,
      { replacements: { s: req.params.id, p: phase || 'in-session', a: req.user?.id || null, b: body || '' } }
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/sessions/:id/sign-off', auth, async (req, res) => {
  try {
    await ensureTables();
    const { role } = req.body || {};
    const [rows] = await sequelize.query(
      `INSERT INTO counseling_sign_offs (session_id, signer_id, role) VALUES (:s, :u, :r) RETURNING *`,
      { replacements: { s: req.params.id, u: req.user?.id || null, r: role || 'genetic_counselor' } }
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
