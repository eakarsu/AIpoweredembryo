const express = require('express');
const { LabResult, Patient } = require('../models');
const { callOpenRouter } = require('../services/openrouter');
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

// POST /api/lab-results/anomaly-detect/:id - flag out-of-range lab values for an IVF cycle
router.post('/anomaly-detect/:id', auth, async (req, res) => {
  try {
    const result = await LabResult.findByPk(req.params.id, { include: [Patient] });
    if (!result) return res.status(404).json({ error: 'Lab result not found' });

    const prompt = `Analyze this IVF lab result for anomalies and clinical significance.
Test: ${result.testName || result.testType || 'unknown'}
Patient Age: ${result.Patient?.age || 'unknown'}
Diagnosis: ${result.Patient?.diagnosis || 'n/a'}
Value: ${result.value || result.result || 'unknown'} ${result.units || ''}
Reference Range: ${result.referenceRange || result.normalRange || 'unknown'}
Status: ${result.status || 'unknown'}
Date: ${result.collectedAt || result.date || 'unknown'}
Notes: ${result.notes || 'n/a'}

Return JSON only:
{
  "is_abnormal": true,
  "severity": "normal|borderline|abnormal|critical",
  "clinical_interpretation": "string",
  "ivf_implications": "string",
  "follow_up_tests": ["string"],
  "protocol_adjustments": ["string"],
  "urgency": "routine|soon|urgent"
}`;

    const aiResponse = await callOpenRouter(prompt);
    res.json({ labResultId: result.id, aiAnalysis: aiResponse });
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
