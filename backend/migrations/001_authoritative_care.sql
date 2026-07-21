BEGIN;
ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'patient';
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "subjectId" TEXT;
ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "licenseVerified" BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS care_users_tenant_idx ON "Users" ("tenantId", id);
CREATE TABLE IF NOT EXISTS care_cases (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, cycle_id TEXT NOT NULL, owner_id TEXT NOT NULL,
 state TEXT NOT NULL, observation_hash CHAR(64) NOT NULL, uncertainty DOUBLE PRECISION NOT NULL CHECK(uncertainty BETWEEN 0 AND 1),
 missing_data JSONB NOT NULL, consent_id TEXT NOT NULL, consent JSONB NOT NULL, advisory JSONB, advisory_hash CHAR(64), advisory_author_id TEXT, clinician_approval_id TEXT,
 follow_up_due_at TIMESTAMPTZ, label TEXT NOT NULL DEFAULT 'NON-DIAGNOSTIC DECISION SUPPORT',
 expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS care_observations (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, case_id TEXT NOT NULL REFERENCES care_cases(id), source_system TEXT NOT NULL,
 source_version TEXT NOT NULL, code TEXT NOT NULL, value JSONB NOT NULL, unit TEXT NOT NULL, uncertainty DOUBLE PRECISION NOT NULL,
 observed_at TIMESTAMPTZ NOT NULL, provenance JSONB NOT NULL, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS care_cases_retention_idx ON care_cases (tenant_id, expires_at);
CREATE TABLE IF NOT EXISTS care_integration_deliveries (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, case_id TEXT NOT NULL REFERENCES care_cases(id), system TEXT NOT NULL,
 resource_type TEXT NOT NULL, idempotency_key TEXT NOT NULL, payload_hash CHAR(64) NOT NULL, payload JSONB NOT NULL,
 status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','leased','retrying','confirmed','dead_letter')),
 attempts INTEGER NOT NULL DEFAULT 0, max_attempts INTEGER NOT NULL DEFAULT 5, next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 last_error TEXT, receipt JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(tenant_id, system, idempotency_key)
);
CREATE TABLE IF NOT EXISTS care_evaluations (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, model_version TEXT NOT NULL, dataset_version TEXT NOT NULL, cohort_version TEXT NOT NULL,
 metrics JSONB NOT NULL, limits JSONB NOT NULL, accepted BOOLEAN NOT NULL, failures JSONB NOT NULL, result_hash CHAR(64) NOT NULL,
 qualified_reviewer_id TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS care_audit (
 id BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, actor_id TEXT NOT NULL, actor_role TEXT NOT NULL,
 action TEXT NOT NULL, resource_type TEXT NOT NULL, resource_id TEXT NOT NULL, before_hash CHAR(64), after_hash CHAR(64),
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb, occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE OR REPLACE FUNCTION care_audit_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'care_audit is append-only'; END; $$;
DROP TRIGGER IF EXISTS care_audit_no_update ON care_audit;
CREATE TRIGGER care_audit_no_update BEFORE UPDATE OR DELETE ON care_audit FOR EACH ROW EXECUTE FUNCTION care_audit_immutable();
COMMIT;
