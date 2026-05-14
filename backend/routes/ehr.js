// EHR / FHIR integration — Apply pass 5 (NEEDS-CREDS).
//
// Original audit / pass-2 backlog: EHR integration via FHIR R4. We gate on
// SMART-on-FHIR client credentials and return 503 + missing env when unset.
//
// Required env vars:
//   FHIR_BASE_URL          (e.g. https://fhir.epic.com/...)
//   FHIR_CLIENT_ID         (registered client ID)
//   FHIR_CLIENT_SECRET     (confidential client; or use PKCE + JWT for public)
//   FHIR_TOKEN_URL         (OAuth2 token endpoint for backend services flow)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

function require503(res, name) {
  return res.status(503).json({ error: `EHR integration not configured: ${name} is missing`, missing: name });
}

router.get('/Patient/:id', auth, async (req, res) => {
  if (!process.env.FHIR_BASE_URL) return require503(res, 'FHIR_BASE_URL');
  if (!process.env.FHIR_CLIENT_ID) return require503(res, 'FHIR_CLIENT_ID');
  if (!process.env.FHIR_CLIENT_SECRET) return require503(res, 'FHIR_CLIENT_SECRET');
  res.json({ note: 'creds present — FHIR Patient/read would run here', resourceType: 'Patient', id: req.params.id });
});

router.get('/Observation', auth, async (req, res) => {
  if (!process.env.FHIR_BASE_URL) return require503(res, 'FHIR_BASE_URL');
  if (!process.env.FHIR_CLIENT_ID) return require503(res, 'FHIR_CLIENT_ID');
  if (!process.env.FHIR_CLIENT_SECRET) return require503(res, 'FHIR_CLIENT_SECRET');
  res.json({ note: 'creds present — FHIR Observation search would run here', searchset: [], total: 0 });
});

router.post('/DiagnosticReport', auth, async (req, res) => {
  if (!process.env.FHIR_BASE_URL) return require503(res, 'FHIR_BASE_URL');
  if (!process.env.FHIR_CLIENT_ID) return require503(res, 'FHIR_CLIENT_ID');
  if (!process.env.FHIR_CLIENT_SECRET) return require503(res, 'FHIR_CLIENT_SECRET');
  res.json({ note: 'creds present — FHIR DiagnosticReport create would run here', request_id: `dr_${Date.now()}` });
});

module.exports = router;
