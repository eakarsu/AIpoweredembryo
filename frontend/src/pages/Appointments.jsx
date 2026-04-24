import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'Patient.firstName', label: 'Patient', render: (i) => i.Patient ? `${i.Patient.firstName} ${i.Patient.lastName}` : 'N/A' },
  { key: 'appointmentDate', label: 'Date & Time', render: (i) => new Date(i.appointmentDate).toLocaleString() },
  { key: 'duration', label: 'Duration (min)' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
];

const detailFields = [
  { key: 'id', label: 'Appointment ID' },
  { key: 'patientId', label: 'Patient ID' },
  { key: 'doctorId', label: 'Doctor ID' },
  { key: 'appointmentDate', label: 'Date & Time' },
  { key: 'duration', label: 'Duration (minutes)' },
  { key: 'type', label: 'Appointment Type' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'patientId', label: 'Patient ID', type: 'number', required: true },
  { key: 'doctorId', label: 'Doctor ID', type: 'number' },
  { key: 'appointmentDate', label: 'Date & Time', type: 'datetime-local', required: true },
  { key: 'duration', label: 'Duration (minutes)', type: 'number' },
  { key: 'type', label: 'Appointment Type' },
  { key: 'status', label: 'Status', type: 'select', options: ['scheduled', 'completed', 'cancelled', 'no_show'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Appointments() {
  return <CrudPage title="Appointments" endpoint="/appointments" columns={columns} formFields={formFields} detailFields={detailFields} />;
}
