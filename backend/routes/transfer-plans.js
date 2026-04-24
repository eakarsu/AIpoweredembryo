const express = require('express');
const { TransferPlan, Patient, Embryo, Doctor } = require('../models');
const { callOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const plans = await TransferPlan.findAll({ include: [Patient], order: [['createdAt', 'DESC']] });
    res.json(plans);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const plan = await TransferPlan.findByPk(req.params.id, { include: [Patient] });
    if (!plan) return res.status(404).json({ error: 'Transfer plan not found' });
    res.json(plan);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const plan = await TransferPlan.create(req.body);
    res.status(201).json(plan);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/optimize/:id', auth, async (req, res) => {
  try {
    const plan = await TransferPlan.findByPk(req.params.id, { include: [Patient] });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const prompt = `Optimize this embryo transfer plan:
- Patient Age: ${plan.Patient?.age}
- Transfer Type: ${plan.transferType}
- Endometrial Thickness: ${plan.endometrialThickness} mm
- Progesterone Level: ${plan.progesteroneLevel} ng/mL
- Estrogen Level: ${plan.estrogenLevel} pg/mL
- Scheduled Date: ${plan.transferDate}

Provide:
1. Optimal transfer window assessment
2. Endometrial receptivity evaluation
3. Hormonal profile analysis
4. Timing recommendations
5. Pre-transfer protocol suggestions
6. Risk factors and mitigations`;

    const aiResponse = await callOpenRouter(prompt);
    res.json({ plan, aiAnalysis: aiResponse });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await TransferPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Transfer plan not found' });
    await plan.update(req.body);
    res.json(plan);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const plan = await TransferPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Transfer plan not found' });
    await plan.destroy();
    res.json({ message: 'Transfer plan deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
