# Completeness Review: AIpoweredembryo

- **Review date:** 2026-07-18
- **Assessment basis:** Static source and configuration inspection only. Dependencies were not installed, and no build, database migration, external integration, or runtime workflow was executed.

## Classification

**Prototype-demo**

## Verdict

This is a clinical/health prototype/demo. Its 94 source files and visible routes/pages demonstrate concepts, but they do not establish durable, integrated, tested execution of the AIpoweredembryo workflow.

## Why it is not complete

- 20 files are explicitly named as gap/backlog surfaces, so page and route counts overstate implemented product capability.
- 23 project-owned files contain direct provider/chat-completion markers; generic model calls are not a substitute for typed domain tools, grounded evidence, deterministic rules, or evaluations.
- 23 files contain mock, sample, placeholder, simulated, or random-data signals, leaving important outcomes disconnected from authoritative systems.
- No explicit schema or migration evidence was found for durable, versioned domain state.
- No recognizable project-owned automated tests were found for the primary workflow.
- No checked-in CI workflow was found to continuously verify builds, tests, migrations, and security checks.
- No environment example/template was found, leaving required configuration and secret boundaries undocumented.

## Needed features

1. Implement the poweredembryo care workflow with validated observations, decisions, ownership, follow-up, and clinician-visible uncertainty.
2. Connect authoritative EHR/FHIR, laboratory/imaging, device, pharmacy, scheduling, or payer systems appropriate to the workflow, with consent and failure handling.
3. Validate clinical accuracy, calibration, contraindications, missing-data behavior, bias, and escalation on versioned representative datasets.
4. Require clinician approval, least-privilege access, consent, immutable audit, retention controls, and a clearly documented non-diagnostic boundary.
5. Replace the generated “Lims And Ehr Modules Exist But Real Adapters Not VPage” gap surface with durable domain state, real integration behavior, explicit failure handling, and acceptance tests.
6. Add contract, integration, authorization, migration, failure-path, and end-to-end tests in CI, plus a documented nondestructive deployment/run path.

## Risks or launch blockers

- Incorrect or unreviewed output can cause patient harm.
- Health data requires strong privacy, access, retention, and audit controls.
- The root launcher can terminate unrelated processes occupying configured ports.
- The root launcher seeds, creates, migrates, or otherwise mutates database state during startup.
- The root launcher installs dependencies at run time, reducing reproducibility and expanding supply-chain risk.

## Evidence inspected

- `frontend/README.md` — inspected project-owned structure or implementation evidence.
- `backend/package.json` — inspected project-owned structure or implementation evidence.
- `backend/models/index.js` — inspected project-owned structure or implementation evidence.
- `backend/routes/gapFeat_ai_route_stubs_ai.js` — inspected project-owned structure or implementation evidence.
- `start.sh` — inspected project-owned structure or implementation evidence.
- `backend/config/database.js` — inspected project-owned structure or implementation evidence.

## Recommended next action

Treat this as a prototype: prove one narrow clinical/health outcome end to end with real data, durable state, domain validation, and tests before expanding its feature catalog.

## Implementation progress (2026-07-19)

1. Implemented a durable, tenant-scoped care-case workflow in `backend/domain/careWorkflow.js`, `backend/routes/authoritative.js`, and `backend/migrations/001_authoritative_care.sql`. It validates traceable observations and bounded uncertainty, records case ownership and follow-up deadlines, exposes missing data and evidence/model/dataset versions, requires guarded state transitions, and labels every advisory as non-diagnostic decision support.
2. Added typed, credential-by-reference adapters for FHIR/EHR, LIMS, laboratory, imaging, device, pharmacy, scheduling, and payer systems in `backend/providers/clinicalProviders.js`. Clinical writes require an approved, unexpired case with active consent; deliveries are durable, tenant-bound, idempotent, payload-hash verified, retried with backoff, and dead-lettered on exhaustion. Consent withdrawal escalates the case and cancels pending delivery.
3. Added versioned model/dataset/cohort evaluation records and fail-closed checks for accuracy, calibration error, contraindication recall, escalation recall, missing-data safety, and group performance deltas. Missing/non-finite metrics are rejected rather than accidentally accepted, stable result hashes make reruns comparable, and only qualified reviewer roles can record results.
4. Enforced patient/tenant scope, least-privilege clinical roles, independently verified doctor approval, active consent at integration time, immutable audit, bounded retention, expired-record exclusion, and an admin-only tenant-scoped purge. The audit's case-patient field stores a tenant-bound hash rather than the source patient identifier. The non-diagnostic boundary is enforced both in advisory validation and API responses and documented in `RUNBOOK.md`.
5. Replaced the LIMS/EHR gap as an authoritative path rather than mounting the generated gap route: source/version provenance is durable, adapters require real configured endpoints and payload-bound receipts, missing configuration and provider failures remain explicit retry/dead-letter states, and loopback acceptance tests verify both success and failure behavior. Legacy and direct-model clinical routes are quarantined with HTTP 410.
6. Added an additive PostgreSQL migration and explicit migration runner, nondestructive readiness-only startup, locked-dependency CI that audits high-severity runtime dependencies and builds the frontend, domain/architecture/provider integration tests, `.env.example`, and a clinical operations runbook. On 2026-07-19, all 16 project-owned tests passed, Node and shell syntax checks passed, backend/frontend runtime audits passed, and the locked frontend production build passed.

External launch gates remain honest: production still requires provisioned PostgreSQL, identity/tenant and verified-license administration, real clinical-system credentials, EHR/LIMS/FHIR conformance testing, representative local dataset validation, privacy/security and bias review, migration/restore rehearsal, operational retention approval, clinical quality-system approval, and a jurisdiction-specific regulatory determination. No clinical accuracy, clinician acceptance, regulatory clearance, live patient use, external provider delivery, or patient outcome is claimed.

## Runtime and login acceptance (2026-07-20)

- The existing root launcher remains a foreground, readiness-only entry point and performs no dependency installation, migration, seed, database reset, or broad process cleanup.
- When `ALLOWED_ORIGINS` is not explicitly configured, the launcher now derives a single loopback origin from `FRONTEND_PORT`. Explicit production allowlists remain authoritative and are never widened.
- The supported local login path uses persisted bcrypt identities and the required strong JWT secret. Public registration creates a tenant-isolated patient identity; clinical roles, licenses, tenant membership, and staff accounts remain out-of-band administrative responsibilities.
