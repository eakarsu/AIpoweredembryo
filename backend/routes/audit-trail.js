// CAP/CLIA audit trail — Apply pass 5 (NEEDS-PRODUCT-DECISION).
//
// PRODUCT-DECISION: CAP and CLIA require change-tracking on lab data and
// access logs. Real compliance involves immutable WORM storage, hashing,
// and retention rules. Pick a reasonable default for now:
//   - audit_log table appended on every endpoint write (call from app code).
//   - Append-only by convention (no UPDATE/DELETE issued).
//   - WORM bucket / hash-chain integration deferred — needs storage decision.
//
// Endpoints exposed here let a privileged user query the trail.
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sequelize = require('../config/database');

async function ensureTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      action VARCHAR(64),
      entity_type VARCHAR(64),
      entity_id INTEGER,
      details JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `).catch(() => {});
  await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id)`).catch(() => {});
  await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id)`).catch(() => {});
}

router.post('/record', auth, async (req, res) => {
  try {
    await ensureTable();
    const { action, entity_type, entity_id, details } = req.body || {};
    if (!action) return res.status(400).json({ error: 'action required' });
    const [rows] = await sequelize.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, details)
       VALUES (:u, :a, :et, :ei, :d) RETURNING *`,
      { replacements: { u: req.user?.id || null, a: action, et: entity_type || null, ei: entity_id || null, d: JSON.stringify(details || {}) } }
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', auth, async (req, res) => {
  try {
    await ensureTable();
    const entityType = req.query.entity_type;
    const entityId = req.query.entity_id;
    let where = '';
    const replacements = {};
    if (entityType) { where = 'WHERE entity_type = :et'; replacements.et = entityType; }
    if (entityType && entityId) { where += ' AND entity_id = :ei'; replacements.ei = entityId; }
    const [rows] = await sequelize.query(
      `SELECT * FROM audit_log ${where} ORDER BY created_at DESC LIMIT 500`,
      { replacements }
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
