const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.tenantId) return res.status(403).json({ error: 'Account has not been assigned to a tenant' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name, tenantId: user.tenantId, subjectId: user.subjectId, licenseVerified: user.licenseVerified }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId, subjectId: user.subjectId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !name || typeof password !== 'string' || password.length < 12) return res.status(422).json({ error: 'Valid email, name, and password of at least 12 characters are required' });
    const hashed = await bcrypt.hash(password, 10);
    const tenantId = crypto.randomUUID();
    const user = await User.create({ email, password: hashed, name, role: 'patient', tenantId });
    user.subjectId = String(user.id); await user.save();
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name, tenantId, subjectId: user.subjectId, licenseVerified: false }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, tenantId, subjectId: user.subjectId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id, tenantId: req.user.tenantId },
      attributes: ['id', 'email', 'name', 'role', 'tenantId', 'subjectId', 'licenseVerified'],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
