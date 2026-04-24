import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'embryoCode', label: 'Code' },
  { key: 'Patient.firstName', label: 'Patient', render: (item) => item.Patient ? `${item.Patient.firstName} ${item.Patient.lastName}` : 'N/A' },
  { key: 'dayOfDevelopment', label: 'Day' },
  { key: 'gardnerGrade', label: 'Grade' },
  { key: 'morphologyScore', label: 'Morph Score' },
  { key: 'aiScore', label: 'AI Score' },
  { key: 'pgtResult', label: 'PGT Result' },
  { key: 'status', label: 'Status' },
];

const detailFields = [
  { key: 'id', label: 'Embryo ID' },
  { key: 'embryoCode', label: 'Embryo Code' },
  { key: 'patientId', label: 'Patient ID' },
  { key: 'cycleId', label: 'Cycle ID' },
  { key: 'dayOfDevelopment', label: 'Day of Development' },
  { key: 'cellCount', label: 'Cell Count' },
  { key: 'fragmentation', label: 'Fragmentation (%)' },
  { key: 'symmetry', label: 'Symmetry' },
  { key: 'gardnerGrade', label: 'Gardner Grade' },
  { key: 'icmGrade', label: 'ICM Grade' },
  { key: 'teGrade', label: 'TE Grade' },
  { key: 'expansionStage', label: 'Expansion Stage' },
  { key: 'morphologyScore', label: 'Morphology Score' },
  { key: 'aiScore', label: 'AI Score' },
  { key: 'pgtResult', label: 'PGT Result' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'patientId', label: 'Patient ID', type: 'number', required: true },
  { key: 'cycleId', label: 'Cycle ID', type: 'number' },
  { key: 'embryoCode', label: 'Embryo Code', required: true },
  { key: 'dayOfDevelopment', label: 'Day of Development', type: 'number' },
  { key: 'cellCount', label: 'Cell Count', type: 'number' },
  { key: 'fragmentation', label: 'Fragmentation (%)', type: 'number' },
  { key: 'symmetry', label: 'Symmetry', type: 'select', options: ['equal', 'slightly_unequal', 'unequal'] },
  { key: 'gardnerGrade', label: 'Gardner Grade' },
  { key: 'icmGrade', label: 'ICM Grade', type: 'select', options: ['A', 'B', 'C', 'D'] },
  { key: 'teGrade', label: 'TE Grade', type: 'select', options: ['A', 'B', 'C', 'D'] },
  { key: 'expansionStage', label: 'Expansion Stage', type: 'number' },
  { key: 'morphologyScore', label: 'Morphology Score', type: 'number' },
  { key: 'pgtResult', label: 'PGT Result', type: 'select', options: ['normal', 'abnormal', 'mosaic', 'pending', 'not_tested'] },
  { key: 'status', label: 'Status', type: 'select', options: ['fresh', 'frozen', 'transferred', 'discarded', 'biopsied'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Embryos() {
  return <CrudPage title="Embryos" endpoint="/embryos" columns={columns} formFields={formFields} detailFields={detailFields} />;
}
