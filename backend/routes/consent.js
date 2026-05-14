// Genetic-test consent management — Apply pass 5 (NEEDS-PRODUCT-DECISION).
//
// PRODUCT-DECISION: HIPAA + GINA + state law govern genetic consent. Until
// legal review, we provide a conservative default:
//   - consent_forms: versioned templates (active flag + legal review date).
//   - patient_consents: per-patient signed records (form version + signed_at).
//   - revocation: stored but DOES NOT cascade-delete data — that needs
//     legal+technical sign-off (right-to-be-forgotten vs lab record retention).
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sequelize = require('../config/database');

async function ensureTables() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS consent_forms (
      id SERIAL PRIMARY KEY,
      version VARCHAR(32) NOT NULL,
      title VARCHAR(255),
      body TEXT,
      active BOOLEAN DEFAULT true,
      legal_reviewed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `).catch(() => {});
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS patient_consents (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER,
      form_id INTEGER,
      form_version VARCHAR(32),
      signed_at TIMESTAMP DEFAULT NOW(),
      revoked_at TIMESTAMP,
      witness_id INTEGER
    )
  `).catch(() => {});
}

router.get('/forms', auth, async (req, res) => {
  try {
    await ensureTables();
    const [rows] = await sequelize.query(`SELECT * FROM consent_forms WHERE active = true ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/forms', auth, async (req, res) => {
  try {
    await ensureTables();
    const { version, title, body, legal_reviewed_at } = req.body || {};
    if (!version) return res.status(400).json({ error: 'version required' });
    const [rows] = await sequelize.query(
      `INSERT INTO consent_forms (version, title, body, legal_reviewed_at)
       VALUES (:v, :t, :b, :l) RETURNING *`,
      { replacements: { v: version, t: title || null, b: body || null, l: legal_reviewed_at || null } }
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/sign', auth, async (req, res) => {
  try {
    await ensureTables();
    const { patient_id, form_id, form_version, witness_id } = req.body || {};
    if (!patient_id || !form_id) return res.status(400).json({ error: 'patient_id + form_id required' });
    const [rows] = await sequelize.query(
      `INSERT INTO patient_consents (patient_id, form_id, form_version, witness_id)
       VALUES (:p, :f, :v, :w) RETURNING *`,
      { replacements: { p: patient_id, f: form_id, v: form_version || null, w: witness_id || null } }
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/revoke', auth, async (req, res) => {
  try {
    await ensureTables();
    const [rows] = await sequelize.query(
      `UPDATE patient_consents SET revoked_at = NOW() WHERE id = :id RETURNING *`,
      { replacements: { id: req.params.id } }
    );
    if (!rows.length) return res.status(404).json({ error: 'consent not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    await ensureTables();
    const [rows] = await sequelize.query(
      `SELECT * FROM patient_consents WHERE patient_id = :p ORDER BY signed_at DESC`,
      { replacements: { p: req.params.patientId } }
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
