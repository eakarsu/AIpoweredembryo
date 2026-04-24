const express = require('express');
const { Patient, TreatmentCycle, Embryo, Appointment, Billing, Doctor } = require('../models');
const { callOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  try {
    const [patients, cycles, embryos, appointments, doctors] = await Promise.all([
      Patient.count(),
      TreatmentCycle.count(),
      Embryo.count(),
      Appointment.count({ where: { status: 'scheduled' } }),
      Doctor.count()
    ]);

    const activeCycles = await TreatmentCycle.count({ where: { status: 'active' } });
    const successfulCycles = await TreatmentCycle.count({ where: { outcome: 'positive' } });
    const totalCompletedCycles = await TreatmentCycle.count({ where: { status: 'completed' } });
    const successRate = totalCompletedCycles > 0 ? ((successfulCycles / totalCompletedCycles) * 100).toFixed(1) : 0;

    const pendingBilling = await Billing.sum('total', { where: { status: 'pending' } });

    res.json({
      totalPatients: patients,
      totalCycles: cycles,
      activeCycles,
      totalEmbryos: embryos,
      upcomingAppointments: appointments,
      totalDoctors: doctors,
      successRate: parseFloat(successRate),
      pendingRevenue: pendingBilling || 0
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/ai-insights', auth, async (req, res) => {
  try {
    const [patients, cycles, embryos] = await Promise.all([
      Patient.count(),
      TreatmentCycle.findAll({ limit: 20, order: [['createdAt', 'DESC']] }),
      Embryo.count()
    ]);

    const successCount = cycles.filter(c => c.outcome === 'positive').length;
    const prompt = `As an IVF clinic AI advisor, provide 5 key insights based on these clinic metrics:
- Total Patients: ${patients}
- Recent Cycles: ${cycles.length}
- Success Rate: ${cycles.length > 0 ? ((successCount/cycles.length)*100).toFixed(1) : 0}%
- Total Embryos: ${embryos}

Provide actionable insights for improving clinic outcomes, each with a title, description, and priority level (high/medium/low).`;

    const aiResponse = await callOpenRouter(prompt);
    res.json({ insights: aiResponse });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
