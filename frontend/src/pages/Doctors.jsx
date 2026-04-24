import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'experience', label: 'Experience (yrs)' },
  { key: 'successRate', label: 'Success Rate', render: (i) => i.successRate ? `${i.successRate}%` : 'N/A' },
  { key: 'status', label: 'Status' },
];

const detailFields = [
  { key: 'id', label: 'Doctor ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'licenseNumber', label: 'License Number' },
  { key: 'experience', label: 'Years of Experience' },
  { key: 'successRate', label: 'Success Rate (%)' },
  { key: 'status', label: 'Status' },
  { key: 'bio', label: 'Bio' },
];

const formFields = [
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'lastName', label: 'Last Name', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'licenseNumber', label: 'License Number' },
  { key: 'experience', label: 'Years of Experience', type: 'number' },
  { key: 'successRate', label: 'Success Rate (%)', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
  { key: 'bio', label: 'Bio', type: 'textarea' },
];

export default function Doctors() {
  return <CrudPage title="Doctors & Staff" endpoint="/doctors" columns={columns} formFields={formFields} detailFields={detailFields} />;
}
