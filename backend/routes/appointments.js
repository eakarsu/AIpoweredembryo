const express = require('express');
const { Appointment, Patient } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const appts = await Appointment.findAll({ include: [Patient], order: [['appointmentDate', 'DESC']] });
    res.json(appts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id, { include: [Patient] });
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appt);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);
    res.status(201).json(appt);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    await appt.update(req.body);
    res.json(appt);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    await appt.destroy();
    res.json({ message: 'Appointment deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
