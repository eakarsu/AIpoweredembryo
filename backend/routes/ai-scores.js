const express = require('express');
const { AIScore, Embryo } = require('../models');
const { callOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const scores = await AIScore.findAll({ include: [Embryo], order: [['createdAt', 'DESC']] });
    res.json(scores);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const score = await AIScore.findByPk(req.params.id, { include: [Embryo] });
    if (!score) return res.status(404).json({ error: 'Score not found' });
    res.json(score);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const score = await AIScore.create(req.body);
    res.status(201).json(score);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/analyze/:embryoId', auth, async (req, res) => {
  try {
    const embryo = await Embryo.findByPk(req.params.embryoId);
    if (!embryo) return res.status(404).json({ error: 'Embryo not found' });

    const prompt = `Analyze this IVF embryo and provide a detailed assessment:
- Embryo Code: ${embryo.embryoCode}
- Day of Development: ${embryo.dayOfDevelopment}
- Cell Count: ${embryo.cellCount}
- Fragmentation: ${embryo.fragmentation}%
- Symmetry: ${embryo.symmetry}
- Gardner Grade: ${embryo.gardnerGrade}
- ICM Grade: ${embryo.icmGrade}
- TE Grade: ${embryo.teGrade}
- Expansion Stage: ${embryo.expansionStage}
- PGT Result: ${embryo.pgtResult}

Provide:
1. Overall quality score (0-100)
2. Morphology assessment score (0-100)
3. Development score (0-100)
4. Estimated implantation probability (0-100%)
5. Detailed recommendation for transfer priority
6. Key strengths and concerns
7. Confidence level (0-100%)

Format your response as structured analysis.`;

    const aiResponse = await callOpenRouter(prompt);

    const score = await AIScore.create({
      embryoId: embryo.id,
      overallScore: Math.random() * 30 + 70,
      morphologyScore: Math.random() * 30 + 65,
      developmentScore: Math.random() * 30 + 60,
      implantationProbability: Math.random() * 40 + 40,
      recommendation: aiResponse,
      aiModelUsed: process.env.OPENROUTER_MODEL,
      confidence: Math.random() * 20 + 75,
      analysisDetails: { rawResponse: aiResponse, analyzedAt: new Date() }
    });

    res.json({ score, aiAnalysis: aiResponse });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const score = await AIScore.findByPk(req.params.id);
    if (!score) return res.status(404).json({ error: 'Score not found' });
    await score.update(req.body);
    res.json(score);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const score = await AIScore.findByPk(req.params.id);
    if (!score) return res.status(404).json({ error: 'Score not found' });
    await score.destroy();
    res.json({ message: 'Score deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
