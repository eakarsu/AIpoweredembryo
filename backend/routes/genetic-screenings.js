const express = require('express');
const { GeneticScreening, Embryo } = require('../models');
const { callOpenRouter } = require('../services/openrouter');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const screenings = await GeneticScreening.findAll({ include: [Embryo], order: [['createdAt', 'DESC']] });
    res.json(screenings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const screening = await GeneticScreening.findByPk(req.params.id, { include: [Embryo] });
    if (!screening) return res.status(404).json({ error: 'Screening not found' });
    res.json(screening);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const screening = await GeneticScreening.create(req.body);
    res.status(201).json(screening);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/analyze/:id', auth, async (req, res) => {
  try {
    const screening = await GeneticScreening.findByPk(req.params.id, { include: [Embryo] });
    if (!screening) return res.status(404).json({ error: 'Screening not found' });

    const prompt = `Analyze this PGT genetic screening result for an IVF embryo:
- Screening Type: ${screening.screeningType}
- Result: ${screening.result}
- Chromosome Details: ${JSON.stringify(screening.chromosomeDetails)}
- Embryo Gardner Grade: ${screening.Embryo?.gardnerGrade}
- Lab: ${screening.labName}

Provide a comprehensive genetic analysis including:
1. Clinical significance of the result
2. Impact on embryo selection decision
3. Risk assessment for genetic conditions
4. Transfer recommendation
5. Genetic counseling points for the patient`;

    const aiResponse = await callOpenRouter(prompt);
    res.json({ screening, aiAnalysis: aiResponse });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const screening = await GeneticScreening.findByPk(req.params.id);
    if (!screening) return res.status(404).json({ error: 'Screening not found' });
    await screening.update(req.body);
    res.json(screening);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const screening = await GeneticScreening.findByPk(req.params.id);
    if (!screening) return res.status(404).json({ error: 'Screening not found' });
    await screening.destroy();
    res.json({ message: 'Screening deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
