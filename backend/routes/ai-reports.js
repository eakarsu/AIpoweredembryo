const express = require('express');
const { AIReport, Patient } = require('../models');
const { callOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const reports = await AIReport.findAll({ include: [Patient], order: [['createdAt', 'DESC']] });
    res.json(reports);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const report = await AIReport.findByPk(req.params.id, { include: [Patient] });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const report = await AIReport.create(req.body);
    res.status(201).json(report);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/generate', auth, async (req, res) => {
  try {
    const { patientId, reportType } = req.body;
    const patient = patientId ? await Patient.findByPk(patientId) : null;

    const prompts = {
      'cycle-summary': `Generate a comprehensive IVF cycle summary report for patient: ${patient?.firstName} ${patient?.lastName}, Age: ${patient?.age}, Diagnosis: ${patient?.diagnosis}. Include treatment overview, response to stimulation, embryo development summary, and recommendations.`,
      'embryo-ranking': `Generate an embryo ranking and selection report. Rank all available embryos by transfer priority considering morphology, genetics, and development stage. Provide rationale for each ranking.`,
      'clinic-performance': `Generate a clinic performance analytics report including: success rates by age group, average embryos per cycle, pregnancy rates, patient satisfaction metrics, and comparison to national averages.`,
      'patient-prognosis': `Generate a detailed patient prognosis report for: ${patient?.firstName} ${patient?.lastName}, Age: ${patient?.age}, AMH: ${patient?.amhLevel}, FSH: ${patient?.fshLevel}, Previous Cycles: ${patient?.previousCycles}. Include success probability, recommended protocol, and timeline.`,
      'lab-quality': `Generate a laboratory quality assurance report covering: culture media quality, incubator conditions, equipment calibration status, staff competency assessments, and QC metrics.`
    };

    const prompt = prompts[reportType] || `Generate a comprehensive ${reportType} report for the IVF clinic.`;
    const aiResponse = await callOpenRouter(prompt);

    const report = await AIReport.create({
      patientId: patientId || null,
      reportType,
      title: `AI ${reportType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Report`,
      content: aiResponse,
      aiAnalysis: { generatedAt: new Date(), model: process.env.OPENROUTER_MODEL },
      generatedBy: 'AI',
      status: 'draft'
    });

    res.json({ report, aiAnalysis: aiResponse });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const report = await AIReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    await report.update(req.body);
    res.json(report);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await AIReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    await report.destroy();
    res.json({ message: 'Report deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
