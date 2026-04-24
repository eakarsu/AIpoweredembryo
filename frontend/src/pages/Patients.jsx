import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'age', label: 'Age' },
  { key: 'diagnosis', label: 'Diagnosis' },
  { key: 'amhLevel', label: 'AMH' },
  { key: 'previousCycles', label: 'Prev Cycles' },
  { key: 'status', label: 'Status' },
];

const detailFields = [
  { key: 'id', label: 'Patient ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'age', label: 'Age' },
  { key: 'bmi', label: 'BMI' },
  { key: 'amhLevel', label: 'AMH Level (ng/mL)' },
  { key: 'fshLevel', label: 'FSH Level (mIU/mL)' },
  { key: 'antralFollicleCount', label: 'Antral Follicle Count' },
  { key: 'previousCycles', label: 'Previous Cycles' },
  { key: 'previousPregnancies', label: 'Previous Pregnancies' },
  { key: 'diagnosis', label: 'Diagnosis' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'lastName', label: 'Last Name', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone' },
  { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { key: 'age', label: 'Age', type: 'number' },
  { key: 'bmi', label: 'BMI', type: 'number' },
  { key: 'amhLevel', label: 'AMH Level', type: 'number' },
  { key: 'fshLevel', label: 'FSH Level', type: 'number' },
  { key: 'antralFollicleCount', label: 'Antral Follicle Count', type: 'number' },
  { key: 'previousCycles', label: 'Previous Cycles', type: 'number' },
  { key: 'previousPregnancies', label: 'Previous Pregnancies', type: 'number' },
  { key: 'diagnosis', label: 'Diagnosis', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'completed'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Patients() {
  return <CrudPage title="Patients" endpoint="/patients" columns={columns} formFields={formFields} detailFields={detailFields} />;
}
