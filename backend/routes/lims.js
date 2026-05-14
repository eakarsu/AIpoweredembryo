// LIMS / HL7 integration — Apply pass 5 (NEEDS-CREDS).
//
// Original audit / pass-2 backlog: LIMS integration via HL7 / Mirth Connect.
// HL7 messaging requires hospital-side configuration (MLLP host/port, sending
// facility, receiving application, optional VPN/IPsec). We gate on env vars.
//
// Required env vars:
//   HL7_HOST, HL7_PORT, HL7_SENDING_APPLICATION, HL7_RECEIVING_APPLICATION
//   MIRTH_API_BASE, MIRTH_API_KEY  (alternative: Mirth REST API)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

function require503(res, name) {
  return res.status(503).json({ error: `LIMS integration not configured: ${name} is missing`, missing: name });
}

router.post('/oru/send', auth, async (req, res) => {
  if (!process.env.HL7_HOST) return require503(res, 'HL7_HOST');
  if (!process.env.HL7_PORT) return require503(res, 'HL7_PORT');
  if (!process.env.HL7_SENDING_APPLICATION) return require503(res, 'HL7_SENDING_APPLICATION');
  // Stub: with creds, we'd open an MLLP socket and frame the ORU^R01.
  res.json({ note: 'creds present — HL7 ORU dispatch would run here', request_id: `oru_${Date.now()}` });
});

router.post('/orm/send', auth, async (req, res) => {
  if (!process.env.HL7_HOST) return require503(res, 'HL7_HOST');
  if (!process.env.HL7_PORT) return require503(res, 'HL7_PORT');
  res.json({ note: 'creds present — HL7 ORM dispatch would run here', request_id: `orm_${Date.now()}` });
});

router.post('/mirth/channel/:channelId/messages', auth, async (req, res) => {
  if (!process.env.MIRTH_API_KEY) return require503(res, 'MIRTH_API_KEY');
  if (!process.env.MIRTH_API_BASE) return require503(res, 'MIRTH_API_BASE');
  res.json({ note: 'creds present — Mirth API call would run here', channel: req.params.channelId, request_id: `mirth_${Date.now()}` });
});

module.exports = router;
