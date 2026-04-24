const express = require('express');
const { QualityControl } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const qc = await QualityControl.findAll({ order: [['createdAt', 'DESC']] });
    res.json(qc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const qc = await QualityControl.findByPk(req.params.id);
    if (!qc) return res.status(404).json({ error: 'QC record not found' });
    res.json(qc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const qc = await QualityControl.create(req.body);
    res.status(201).json(qc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const qc = await QualityControl.findByPk(req.params.id);
    if (!qc) return res.status(404).json({ error: 'QC record not found' });
    await qc.update(req.body);
    res.json(qc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const qc = await QualityControl.findByPk(req.params.id);
    if (!qc) return res.status(404).json({ error: 'QC record not found' });
    await qc.destroy();
    res.json({ message: 'QC record deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
