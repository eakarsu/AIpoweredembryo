# Non-diagnostic care workflow runbook

This service is non-diagnostic decision support. It must not select embryos, diagnose, prescribe, predict a guaranteed outcome, or replace clinical judgment.

Install from lockfiles, copy `.env.example`, and run `npm run migrate` in `backend/` with a migration role. `./start.sh backend` is nondestructive and fails if `care_cases` is missing. Staff accounts, verified licenses, tenant assignments, and roles are provisioned out of band; public registration creates only an isolated patient identity.

Use `/api/authoritative/care`. Every advisory must expose uncertainty, missing data, versioned evidence, the non-diagnostic label, and independent approval by a qualified doctor before integration or follow-up. Consent and patient scope are checked on every case. Generated and legacy clinical endpoints are quarantined.

Alert on missing/withdrawn consent, overdue follow-up, unsafe evaluation results, calibration/bias drift, integration retries, and dead letters. A clinician reviews all corrections and replays. Preserve immutable audit and provenance according to the approved retention policy. No real clinical use is authorized until local validation, security/privacy review, quality-system approval, regulatory determination, and live EHR/LIMS conformance testing are complete.

Consent withdrawal immediately escalates the case and dead-letters any undelivered integration work. Expired cases are hidden from the supported read and delivery paths. An administrator may run the bounded, tenant-scoped `POST /api/authoritative/care/retention/purge` job after the approved retention window; the audit's `patient_id` field contains a tenant-bound hash, while the immutable audit itself follows its separately approved security-retention policy.
