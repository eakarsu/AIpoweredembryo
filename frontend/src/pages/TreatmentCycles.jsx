import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'Patient.firstName', label: 'Patient', render: (item) => item.Patient ? `${item.Patient.firstName} ${item.Patient.lastName}` : 'N/A' },
  { key: 'cycleNumber', label: 'Cycle #' },
  { key: 'cycleType', label: 'Type' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'eggsRetrieved', label: 'Eggs' },
  { key: 'embryosCreated', label: 'Embryos' },
  { key: 'outcome', label: 'Outcome' },
  { key: 'status', label: 'Status' },
];

const detailFields = [
  { key: 'id', label: 'Cycle ID' },
  { key: 'patientId', label: 'Patient ID' },
  { key: 'cycleNumber', label: 'Cycle Number' },
  { key: 'cycleType', label: 'Cycle Type' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'protocol', label: 'Protocol' },
  { key: 'stimDuration', label: 'Stim Duration (days)' },
  { key: 'eggsRetrieved', label: 'Eggs Retrieved' },
  { key: 'eggsMature', label: 'Mature Eggs' },
  { key: 'eggsFertilized', label: 'Eggs Fertilized' },
  { key: 'embryosCreated', label: 'Embryos Created' },
  { key: 'embryosTransferred', label: 'Embryos Transferred' },
  { key: 'outcome', label: 'Outcome' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'patientId', label: 'Patient ID', type: 'number', required: true },
  { key: 'cycleNumber', label: 'Cycle Number', type: 'number' },
  { key: 'cycleType', label: 'Cycle Type', type: 'select', options: ['IVF', 'ICSI', 'FET', 'IUI', 'Natural'] },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  { key: 'endDate', label: 'End Date', type: 'date' },
  { key: 'protocol', label: 'Protocol' },
  { key: 'stimDuration', label: 'Stim Duration (days)', type: 'number' },
  { key: 'eggsRetrieved', label: 'Eggs Retrieved', type: 'number' },
  { key: 'eggsMature', label: 'Mature Eggs', type: 'number' },
  { key: 'eggsFertilized', label: 'Eggs Fertilized', type: 'number' },
  { key: 'embryosCreated', label: 'Embryos Created', type: 'number' },
  { key: 'embryosTransferred', label: 'Embryos Transferred', type: 'number' },
  { key: 'outcome', label: 'Outcome', type: 'select', options: ['pending', 'positive', 'negative', 'chemical', 'ectopic', 'miscarriage'] },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'completed', 'cancelled'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function TreatmentCycles() {
  return <CrudPage title="Treatment Cycles" endpoint="/cycles" columns={columns} formFields={formFields} detailFields={detailFields} />;
}
