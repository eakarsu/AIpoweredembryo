import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'Patient.firstName', label: 'Patient', render: (i) => i.Patient ? `${i.Patient.firstName} ${i.Patient.lastName}` : 'N/A' },
  { key: 'successProbability', label: 'Success %', render: (i) => `${i.successProbability?.toFixed(1)}%` },
  { key: 'aiModelUsed', label: 'Model' },
  { key: 'actualOutcome', label: 'Actual Outcome' },
  { key: 'createdAt', label: 'Date', render: (i) => new Date(i.createdAt).toLocaleDateString() },
];

const detailFields = [
  { key: 'id', label: 'Prediction ID' },
  { key: 'patientId', label: 'Patient ID' },
  { key: 'cycleId', label: 'Cycle ID' },
  { key: 'embryoId', label: 'Embryo ID' },
  { key: 'successProbability', label: 'Success Probability' },
  { key: 'factors', label: 'Factors' },
  { key: 'aiModelUsed', label: 'AI Model' },
  { key: 'actualOutcome', label: 'Actual Outcome' },
];

const formFields = [
  { key: 'patientId', label: 'Patient ID', type: 'number', required: true },
  { key: 'cycleId', label: 'Cycle ID', type: 'number' },
  { key: 'embryoId', label: 'Embryo ID', type: 'number' },
  { key: 'successProbability', label: 'Success Probability (%)', type: 'number' },
  { key: 'actualOutcome', label: 'Actual Outcome' },
  { key: 'recommendation', label: 'Recommendation', type: 'textarea' },
];

export default function Predictions() {
  return <CrudPage
    title="Pregnancy Predictions"
    endpoint="/predictions"
    columns={columns}
    formFields={formFields}
    detailFields={detailFields}
    aiAction="/predictions/predict/:id"
    aiLabel="AI Predict Success"
    aiIdField="patientId"
  />;
}
