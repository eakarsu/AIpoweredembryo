// External lab-vendor integrations — Apply pass 5 (NEEDS-CREDS).
//
// Original audit / pass-2 backlog: Cooper Genomics, Igenomix, Natera, etc.
// Each vendor has its own API; we gate per-vendor on env vars.
//
// Required env vars:
//   COOPER_API_KEY        (Cooper Genomics)
//   IGENOMIX_API_KEY      (Igenomix CooperSurgical)
//   NATERA_API_KEY        (Natera)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

function require503(res, name) {
  return res.status(503).json({ error: `Lab vendor not configured: ${name} is missing`, missing: name });
}

router.post('/cooper/order', auth, async (req, res) => {
  if (!process.env.COOPER_API_KEY) return require503(res, 'COOPER_API_KEY');
  res.json({ vendor: 'cooper', note: 'creds present — order would be dispatched', request_id: `cg_${Date.now()}` });
});

router.post('/igenomix/order', auth, async (req, res) => {
  if (!process.env.IGENOMIX_API_KEY) return require503(res, 'IGENOMIX_API_KEY');
  res.json({ vendor: 'igenomix', note: 'creds present — order would be dispatched', request_id: `ig_${Date.now()}` });
});

router.post('/natera/order', auth, async (req, res) => {
  if (!process.env.NATERA_API_KEY) return require503(res, 'NATERA_API_KEY');
  res.json({ vendor: 'natera', note: 'creds present — order would be dispatched', request_id: `nt_${Date.now()}` });
});

module.exports = router;
