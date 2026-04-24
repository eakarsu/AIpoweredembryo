import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'Patient.firstName', label: 'Patient', render: (i) => i.Patient ? `${i.Patient.firstName} ${i.Patient.lastName}` : 'N/A' },
  { key: 'testType', label: 'Test Type' },
  { key: 'testDate', label: 'Date' },
  { key: 'result', label: 'Result' },
  { key: 'referenceRange', label: 'Reference' },
  { key: 'status', label: 'Status' },
];

const detailFields = [
  { key: 'id', label: 'Result ID' },
  { key: 'patientId', label: 'Patient ID' },
  { key: 'cycleId', label: 'Cycle ID' },
  { key: 'testType', label: 'Test Type' },
  { key: 'testDate', label: 'Test Date' },
  { key: 'result', label: 'Result' },
  { key: 'value', label: 'Value' },
  { key: 'unit', label: 'Unit' },
  { key: 'referenceRange', label: 'Reference Range' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'patientId', label: 'Patient ID', type: 'number', required: true },
  { key: 'cycleId', label: 'Cycle ID', type: 'number' },
  { key: 'testType', label: 'Test Type', required: true },
  { key: 'testDate', label: 'Test Date', type: 'date' },
  { key: 'result', label: 'Result' },
  { key: 'value', label: 'Value', type: 'number' },
  { key: 'unit', label: 'Unit' },
  { key: 'referenceRange', label: 'Reference Range' },
  { key: 'status', label: 'Status', type: 'select', options: ['normal', 'abnormal', 'critical', 'pending'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function LabResults() {
  return <CrudPage title="Lab Results" endpoint="/lab-results" columns={columns} formFields={formFields} detailFields={detailFields} />;
}
