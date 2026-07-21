'use strict';
const crypto = require('crypto');
const transitions = { intake: ['observations_validated', 'escalated'], observations_validated: ['clinician_review', 'escalated'], clinician_review: ['advisory_approved', 'corrected', 'escalated'], advisory_approved: ['integration_queued', 'follow_up'], integration_queued: ['follow_up', 'escalated'], follow_up: ['closed', 'corrected', 'escalated'], corrected: ['clinician_review'], escalated: ['clinician_review'], closed: [] };
const permissions = { patient: ['read_self', 'consent'], nurse: ['read', 'record'], embryologist: ['read', 'record', 'review_lab'], doctor: ['read', 'record', 'approve', 'correct'], compliance: ['read_audit'], admin: ['read', 'record', 'approve', 'correct', 'configure', 'read_audit'] };
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.keys(value).sort().reduce((out,key)=>{out[key]=canonical(value[key]);return out;},{}):value;
const hash = value => crypto.createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
function requireScope(actor, tenantId, subjectId, action) {
  if (!actor || actor.tenantId !== tenantId) throw new Error('tenant_scope_denied');
  if (actor.role === 'patient' && actor.subjectId !== subjectId) throw new Error('subject_scope_denied');
  if (!(permissions[actor.role] || []).includes(action)) throw new Error('role_scope_denied');
}
function validateObservations(input) {
  for (const field of ['patientId', 'cycleId', 'sourceSystem', 'sourceVersion', 'observations', 'consentId', 'consent']) if (!input[field] || (Array.isArray(input[field]) && !input[field].length)) throw new Error(`missing_${field}`);
  if (input.consent.status !== 'granted' || !input.consent.scope || !Number.isInteger(input.consent.retentionDays) || input.consent.retentionDays < 1 || input.consent.retentionDays > 3650) throw new Error('valid_consent_and_retention_required');
  if (!Array.isArray(input.observations) || input.observations.some(o => !o.code || o.value === undefined || !o.unit || !o.observedAt || Number.isNaN(Date.parse(o.observedAt)) || !Number.isFinite(o.uncertainty) || o.uncertainty < 0 || o.uncertainty > 1)) throw new Error('invalid_observation');
  return { ...input, observationHash: hash(input.observations), state: 'observations_validated' };
}
function validateAdvisory(advisory) {
  if (!advisory.modelVersion || !advisory.datasetVersion || !Array.isArray(advisory.evidence) || !advisory.evidence.length) throw new Error('versioned_evidence_required');
  if (!Array.isArray(advisory.missingData) || !Number.isFinite(advisory.uncertainty)) throw new Error('uncertainty_and_missing_data_required');
  if (advisory.diagnosis || advisory.prescription || advisory.autonomousSelection || advisory.claimsOutcome) throw new Error('diagnostic_or_autonomous_claim_forbidden');
  return { ...advisory, label: 'NON-DIAGNOSTIC DECISION SUPPORT', advisoryHash: hash(advisory) };
}
function transition(current, target, context = {}) {
  if (!(transitions[current] || []).includes(target)) throw new Error('invalid_transition');
  if (target === 'advisory_approved') {
    if (!context.clinician || !['doctor'].includes(context.clinician.role) || !context.clinician.licenseVerified) throw new Error('qualified_clinician_required');
    if (context.clinician.id === context.authorId) throw new Error('independent_clinician_review_required');
  }
  if (target === 'follow_up' && (!context.ownerId || !context.dueAt)) throw new Error('follow_up_owner_and_due_date_required');
  return target;
}
function integrationDelivery(system, resourceType, payload, idempotencyKey, receipt) {
  if (!['FHIR', 'EHR', 'LIMS', 'LAB', 'IMAGING', 'DEVICE', 'PHARMACY', 'SCHEDULING', 'PAYER'].includes(system)) throw new Error('unsupported_clinical_adapter');
  if (!resourceType || !idempotencyKey) throw new Error('integration_identity_required');
  const payloadHash = hash(payload);
  if (receipt && receipt.payloadHash !== payloadHash) throw new Error('receipt_payload_mismatch');
  return { system, resourceType, payloadHash, idempotencyKey, state: receipt ? 'confirmed' : 'queued', receipt: receipt || null };
}
function evaluate(metrics, limits) {
  const requiredMetrics = ['accuracy', 'calibrationError', 'contraindicationRecall', 'escalationRecall', 'maxGroupDelta', 'missingDataSafety'];
  const requiredLimits = ['minAccuracy', 'maxCalibrationError', 'minContraindicationRecall', 'minEscalationRecall', 'maxGroupDelta'];
  if (requiredMetrics.some(key => !Number.isFinite(metrics[key])) || requiredLimits.some(key => !Number.isFinite(limits[key]))) throw new Error('complete_finite_evaluation_required');
  const failures = [];
  if (metrics.accuracy < limits.minAccuracy) failures.push('accuracy');
  if (metrics.calibrationError > limits.maxCalibrationError) failures.push('calibration');
  if (metrics.contraindicationRecall < limits.minContraindicationRecall) failures.push('contraindications');
  if (metrics.escalationRecall < limits.minEscalationRecall) failures.push('escalation');
  if (metrics.maxGroupDelta > limits.maxGroupDelta) failures.push('bias');
  if (metrics.missingDataSafety < 1) failures.push('missing_data_safety');
  return { accepted: !failures.length, failures, resultHash: hash({ metrics, limits }) };
}
module.exports = { hash, requireScope, validateObservations, validateAdvisory, transition, integrationDelivery, evaluate };
