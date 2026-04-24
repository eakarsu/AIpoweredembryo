const express = require('express');
const { TreatmentCycle, Patient } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const cycles = await TreatmentCycle.findAll({ include: [Patient], order: [['createdAt', 'DESC']] });
    res.json(cycles);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const cycle = await TreatmentCycle.findByPk(req.params.id, { include: [Patient] });
    if (!cycle) return res.status(404).json({ error: 'Cycle not found' });
    res.json(cycle);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const cycle = await TreatmentCycle.create(req.body);
    res.status(201).json(cycle);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const cycle = await TreatmentCycle.findByPk(req.params.id);
    if (!cycle) return res.status(404).json({ error: 'Cycle not found' });
    await cycle.update(req.body);
    res.json(cycle);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const cycle = await TreatmentCycle.findByPk(req.params.id);
    if (!cycle) return res.status(404).json({ error: 'Cycle not found' });
    await cycle.destroy();
    res.json({ message: 'Cycle deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
