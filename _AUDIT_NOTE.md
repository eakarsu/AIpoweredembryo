# Audit Note — AIpoweredembryo

Source: `/Users/erolakarsu/projects/_AUDIT/reports/batch_06.md` section #27.

## Original Recommendations
TSV said `0 AI endpoints`, but `ai-scores.js`, `predictions.js`, `genetic-screenings.js` already use `callOpenRouter`. The audit count is wrong on inspection.

### Gaps — AI Counterparts
- `/embryo-scoring-ai` — already exists as `POST /api/ai-scores/analyze/:embryoId`
- `/genetic-risk-assess` (added)
- `/implantation-predict` — already exists as `POST /api/predictions/predict/:patientId`
- `/lab-anomaly-detect` (added)

### Gaps — Non-AI Features
- LIMS integration
- EHR integration
- Genetic counseling workflow documentation
- CAP/CLIA compliance tracking
- Genetic-test consent management

### Custom Feature Suggestions
1. Agentic embryo selection
2. Computer-vision embryo grading
3. Implantation probability ensemble
4. Genetic-disease screening assistant
5. Cycle protocol optimization

## Implemented (Mechanical)
- `POST /api/lab-results/anomaly-detect/:id` — added in `backend/routes/lab-results.js`. Pulls a lab result + patient context and asks the model whether it is abnormal, clinical interpretation, IVF implications, follow-up tests, urgency.
- `POST /api/genetic-screenings/risk-assess/:id` — added in `backend/routes/genetic-screenings.js`. Runs a disease-predisposition / counseling risk assessment for a screening record.

Both follow existing `callOpenRouter` pattern + `auth` middleware.

## Backlog (deferred)

### NEEDS-CREDS / NEW-DEPS
- LIMS integration (Mirth/HL7 messaging).
- EHR integration (FHIR).
- Lab vendor APIs (Cooper Genomics, etc.).

### NEEDS-PRODUCT-DECISION
- Genetic counseling documentation workflow (compliance, sign-off).
- CAP/CLIA audit trail data model.
- Consent management for genetic testing (legal review).

### TOO-RISKY (regulatory / clinical)
- Computer-vision microscope grading (model + cost + validation).
- Auto-recommended transfer order (clinical liability — must remain advisory).
- Cycle-protocol optimization (medication recommendations need clinician sign-off).

## Apply pass 3 (frontend)

FE already wired. `frontend/src/pages/GeneticRiskAssess.jsx` posts to `/genetic-screenings/risk-assess/:id`; `pages/LabAnomalyDetect.jsx` posts to `/lab-results/anomaly-detect/:id`. `App.jsx` routes and `components/Layout.jsx` nav entries are present. `pages/AIScores.jsx`, `Predictions.jsx`, `AIReports.jsx` cover the older AI endpoints. No changes needed.

## Apply pass 4 (mechanical backlog)

**SKIPPED.** Every Backlog row is tagged NEEDS-CREDS / NEW-DEPS (LIMS/HL7, FHIR EHR, Cooper Genomics), NEEDS-PRODUCT-DECISION (genetic counseling workflow, CAP/CLIA audit trail, consent management), or TOO-RISKY (computer-vision microscope grading, auto-recommended transfer order, cycle-protocol optimization — all carry clinical liability and require clinician sign-off). The two pass-2 endpoints (`/lab-results/anomaly-detect/:id`, `/genetic-screenings/risk-assess/:id`) plus the existing `/ai-scores/analyze/:embryoId`, `/predictions/predict/:patientId`, and `/ai-reports/*` cover the mechanical AI counterparts identified in the audit. No new backend endpoints or FE pages added.
