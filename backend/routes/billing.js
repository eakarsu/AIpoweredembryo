const express = require('express');
const { Billing, Patient } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const bills = await Billing.findAll({ include: [Patient], order: [['createdAt', 'DESC']] });
    res.json(bills);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const bill = await Billing.findByPk(req.params.id, { include: [Patient] });
    if (!bill) return res.status(404).json({ error: 'Billing record not found' });
    res.json(bill);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const bill = await Billing.create(req.body);
    res.status(201).json(bill);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const bill = await Billing.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Billing record not found' });
    await bill.update(req.body);
    res.json(bill);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const bill = await Billing.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Billing record not found' });
    await bill.destroy();
    res.json({ message: 'Billing record deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
