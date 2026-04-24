import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'embryoId', label: 'Embryo ID' },
  { key: 'screeningType', label: 'Type' },
  { key: 'testDate', label: 'Date' },
  { key: 'result', label: 'Result' },
  { key: 'labName', label: 'Lab' },
];

const detailFields = [
  { key: 'id', label: 'Screening ID' },
  { key: 'embryoId', label: 'Embryo ID' },
  { key: 'patientId', label: 'Patient ID' },
  { key: 'screeningType', label: 'Screening Type' },
  { key: 'testDate', label: 'Test Date' },
  { key: 'result', label: 'Result' },
  { key: 'chromosomeDetails', label: 'Chromosome Details' },
  { key: 'labName', label: 'Lab Name' },
];

const formFields = [
  { key: 'embryoId', label: 'Embryo ID', type: 'number', required: true },
  { key: 'patientId', label: 'Patient ID', type: 'number' },
  { key: 'screeningType', label: 'Screening Type', type: 'select', options: ['PGT-A', 'PGT-M', 'PGT-SR', 'PGT-P'] },
  { key: 'testDate', label: 'Test Date', type: 'date' },
  { key: 'result', label: 'Result', type: 'select', options: ['euploid', 'aneuploid', 'mosaic', 'no_result', 'pending'] },
  { key: 'labName', label: 'Lab Name' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function GeneticScreenings() {
  return <CrudPage
    title="Genetic Screenings"
    endpoint="/genetic-screenings"
    columns={columns}
    formFields={formFields}
    detailFields={detailFields}
    aiAction="/genetic-screenings/analyze/:id"
    aiLabel="AI Genetic Analysis"
  />;
}
