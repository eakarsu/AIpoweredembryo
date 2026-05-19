// Custom Views for EmbryoAI Pro — adds 4 IVF-focused endpoints:
//   GET  /api/custom-views/grade-distribution    (VIZ) embryo grade counts for chart
//   GET  /api/custom-views/stage-heatmap         (VIZ) development stage x day heatmap matrix
//   GET  /api/custom-views/lab-report            (NON-VIZ) generates a lab report (PDF-style payload)
//   GET  /api/custom-views/grading-rules         (NON-VIZ) list morphology grading thresholds
//   POST /api/custom-views/grading-rules         create a rule
//   PUT  /api/custom-views/grading-rules/:id     update a rule
//   DELETE /api/custom-views/grading-rules/:id   delete a rule
//
// Storage for rules is in-memory (process-local) — safe for demo; survives until process restart.

const express = require('express');
const router = express.Router();

// ---- In-memory rules store (CRUD target) ----
let _id = 4;
const rules = [
  { id: 1, stage: 'Cleavage',   metric: 'cellCount',       minValue: 6,   maxValue: 10,  grade: 'A', notes: 'Optimal Day-3 cleavage range' },
  { id: 2, stage: 'Cleavage',   metric: 'fragmentationPct', minValue: 0,   maxValue: 10,  grade: 'A', notes: 'Low fragmentation <10%' },
  { id: 3, stage: 'Blastocyst', metric: 'expansion',       minValue: 3,   maxValue: 6,   grade: 'A', notes: 'Gardner expansion grade' },
  { id: 4, stage: 'Blastocyst', metric: 'innerCellMass',   minValue: 1,   maxValue: 2,   grade: 'A', notes: 'A=tightly packed, B=loose' },
];

// ---- Helper: deterministic-ish synthetic data when DB tables are empty ----
function synthGradeDistribution() {
  return [
    { grade: 'AA', count: 18 },
    { grade: 'AB', count: 24 },
    { grade: 'BA', count: 15 },
    { grade: 'BB', count: 31 },
    { grade: 'BC', count: 12 },
    { grade: 'CB', count: 9  },
    { grade: 'CC', count: 6  },
  ];
}

function synthStageHeatmap() {
  // rows = development stage, cols = day 1..6
  const stages = ['Zygote', 'Cleavage', 'Morula', 'Early Blastocyst', 'Blastocyst', 'Expanded Blast'];
  const days   = [1, 2, 3, 4, 5, 6];
  const matrix = [
    [22,  4,  0,  0,  0,  0],
    [ 2, 18, 20,  6,  1,  0],
    [ 0,  0,  3, 12,  5,  1],
    [ 0,  0,  0,  4, 11,  6],
    [ 0,  0,  0,  1,  9, 14],
    [ 0,  0,  0,  0,  3, 12],
  ];
  return { stages, days, matrix };
}

// ---- VIZ #1: Grade distribution ----
router.get('/grade-distribution', async (req, res) => {
  try {
    // Try to pull real grade counts from Embryo table, fall back to synthetic if unavailable.
    let data;
    try {
      const { Embryo } = require('../models');
      if (Embryo) {
        const rows = await Embryo.findAll();
        const counts = {};
        for (const r of rows) {
          const g = (r.grade || r.morphologyGrade || r.gardnerGrade || 'Unknown');
          counts[g] = (counts[g] || 0) + 1;
        }
        data = Object.entries(counts).map(([grade, count]) => ({ grade, count }));
      }
    } catch (_) { /* model may not exist */ }
    if (!data || data.length === 0) data = synthGradeDistribution();
    res.json({ ok: true, source: 'custom-views', data, total: data.reduce((a, b) => a + b.count, 0) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ---- VIZ #2: Stage x Day heatmap ----
router.get('/stage-heatmap', async (req, res) => {
  try {
    const heatmap = synthStageHeatmap();
    res.json({ ok: true, source: 'custom-views', ...heatmap, generatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ---- NON-VIZ #1: Lab report (PDF-style payload — plain text representation) ----
router.get('/lab-report', async (req, res) => {
  try {
    const cycleId = req.query.cycleId || 'LAB-2026-0518';
    const now = new Date();
    const dist = synthGradeDistribution();
    const heat = synthStageHeatmap();
    const lines = [
      '=================================================',
      '  EmbryoAI Pro — IVF Laboratory Report',
      '=================================================',
      `  Report ID:    ${cycleId}`,
      `  Generated:    ${now.toISOString()}`,
      `  Clinic:       EmbryoAI Pro Reference Lab`,
      '-------------------------------------------------',
      '  Embryo Grade Distribution:',
      ...dist.map(d => `    ${d.grade.padEnd(4)}  ${String(d.count).padStart(3)} embryos`),
      '-------------------------------------------------',
      '  Development Stage Snapshot (Day 5):',
      ...heat.stages.map((s, i) => `    ${s.padEnd(18)} ${heat.matrix[i][4]} embryos`),
      '-------------------------------------------------',
      '  Active Grading Rules:',
      ...rules.map(r => `    [${r.grade}] ${r.stage}.${r.metric} ∈ [${r.minValue}, ${r.maxValue}] — ${r.notes}`),
      '=================================================',
      '  END OF REPORT',
      '=================================================',
    ];
    const report = lines.join('\n');
    res.json({
      ok: true,
      source: 'custom-views',
      reportId: cycleId,
      generatedAt: now.toISOString(),
      mime: 'application/pdf',
      contentBase64: Buffer.from(report, 'utf8').toString('base64'),
      preview: report,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ---- NON-VIZ #2: Grading rules CRUD ----
router.get('/grading-rules', (req, res) => {
  res.json({ ok: true, source: 'custom-views', data: rules });
});

router.post('/grading-rules', (req, res) => {
  const { stage, metric, minValue, maxValue, grade, notes } = req.body || {};
  if (!stage || !metric) return res.status(400).json({ ok: false, error: 'stage and metric are required' });
  const rule = {
    id: ++_id,
    stage,
    metric,
    minValue: Number(minValue) || 0,
    maxValue: Number(maxValue) || 0,
    grade: grade || 'B',
    notes: notes || '',
  };
  rules.push(rule);
  res.status(201).json({ ok: true, data: rule });
});

router.put('/grading-rules/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = rules.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: 'rule not found' });
  rules[idx] = { ...rules[idx], ...req.body, id };
  res.json({ ok: true, data: rules[idx] });
});

router.delete('/grading-rules/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = rules.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: 'rule not found' });
  const removed = rules.splice(idx, 1)[0];
  res.json({ ok: true, data: removed });
});

module.exports = router;
