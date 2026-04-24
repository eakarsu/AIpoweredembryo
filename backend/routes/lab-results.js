const express = require('express');
const { LabResult, Patient } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const results = await LabResult.findAll({ include: [Patient], order: [['createdAt', 'DESC']] });
    res.json(results);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await LabResult.findByPk(req.params.id, { include: [Patient] });
    if (!result) return res.status(404).json({ error: 'Lab result not found' });
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const result = await LabResult.create(req.body);
    res.status(201).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const result = await LabResult.findByPk(req.params.id);
    if (!result) return res.status(404).json({ error: 'Lab result not found' });
    await result.update(req.body);
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await LabResult.findByPk(req.params.id);
    if (!result) return res.status(404).json({ error: 'Lab result not found' });
    await result.destroy();
    res.json({ message: 'Lab result deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
