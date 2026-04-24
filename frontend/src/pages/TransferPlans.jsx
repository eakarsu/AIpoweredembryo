import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'Patient.firstName', label: 'Patient', render: (i) => i.Patient ? `${i.Patient.firstName} ${i.Patient.lastName}` : 'N/A' },
  { key: 'transferDate', label: 'Transfer Date' },
  { key: 'transferType', label: 'Type' },
  { key: 'endometrialThickness', label: 'Endo (mm)' },
  { key: 'status', label: 'Status' },
  { key: 'outcome', label: 'Outcome' },
];

const detailFields = [
  { key: 'id', label: 'Plan ID' },
  { key: 'patientId', label: 'Patient ID' },
  { key: 'cycleId', label: 'Cycle ID' },
  { key: 'embryoId', label: 'Embryo ID' },
  { key: 'doctorId', label: 'Doctor ID' },
  { key: 'transferDate', label: 'Transfer Date' },
  { key: 'transferType', label: 'Transfer Type' },
  { key: 'endometrialThickness', label: 'Endometrial Thickness (mm)' },
  { key: 'progesteroneLevel', label: 'Progesterone (ng/mL)' },
  { key: 'estrogenLevel', label: 'Estrogen (pg/mL)' },
  { key: 'status', label: 'Status' },
  { key: 'outcome', label: 'Outcome' },
];

const formFields = [
  { key: 'patientId', label: 'Patient ID', type: 'number', required: true },
  { key: 'cycleId', label: 'Cycle ID', type: 'number' },
  { key: 'embryoId', label: 'Embryo ID', type: 'number' },
  { key: 'doctorId', label: 'Doctor ID', type: 'number' },
  { key: 'transferDate', label: 'Transfer Date', type: 'date' },
  { key: 'transferType', label: 'Transfer Type', type: 'select', options: ['fresh', 'frozen', 'natural'] },
  { key: 'endometrialThickness', label: 'Endometrial Thickness (mm)', type: 'number' },
  { key: 'progesteroneLevel', label: 'Progesterone (ng/mL)', type: 'number' },
  { key: 'estrogenLevel', label: 'Estrogen (pg/mL)', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['planned', 'completed', 'cancelled', 'postponed'] },
  { key: 'outcome', label: 'Outcome' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function TransferPlans() {
  return <CrudPage
    title="Transfer Plans"
    endpoint="/transfer-plans"
    columns={columns}
    formFields={formFields}
    detailFields={detailFields}
    aiAction="/transfer-plans/optimize/:id"
    aiLabel="AI Optimize Transfer"
  />;
}
