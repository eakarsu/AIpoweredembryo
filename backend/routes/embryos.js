const express = require('express');
const { Embryo, Patient, TreatmentCycle, AIScore } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const embryos = await Embryo.findAll({ include: [Patient, TreatmentCycle], order: [['createdAt', 'DESC']] });
    res.json(embryos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const embryo = await Embryo.findByPk(req.params.id, { include: [Patient, TreatmentCycle, AIScore] });
    if (!embryo) return res.status(404).json({ error: 'Embryo not found' });
    res.json(embryo);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const embryo = await Embryo.create(req.body);
    res.status(201).json(embryo);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const embryo = await Embryo.findByPk(req.params.id);
    if (!embryo) return res.status(404).json({ error: 'Embryo not found' });
    await embryo.update(req.body);
    res.json(embryo);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const embryo = await Embryo.findByPk(req.params.id);
    if (!embryo) return res.status(404).json({ error: 'Embryo not found' });
    await embryo.destroy();
    res.json({ message: 'Embryo deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
