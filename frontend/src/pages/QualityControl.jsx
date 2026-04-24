import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'category', label: 'Category' },
  { key: 'metric', label: 'Metric' },
  { key: 'value', label: 'Value' },
  { key: 'target', label: 'Target' },
  { key: 'unit', label: 'Unit' },
  { key: 'checkDate', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const detailFields = [
  { key: 'id', label: 'QC ID' },
  { key: 'category', label: 'Category' },
  { key: 'metric', label: 'Metric' },
  { key: 'value', label: 'Value' },
  { key: 'target', label: 'Target' },
  { key: 'unit', label: 'Unit' },
  { key: 'checkDate', label: 'Check Date' },
  { key: 'performedBy', label: 'Performed By' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'category', label: 'Category', required: true },
  { key: 'metric', label: 'Metric', required: true },
  { key: 'value', label: 'Value', type: 'number' },
  { key: 'target', label: 'Target', type: 'number' },
  { key: 'unit', label: 'Unit' },
  { key: 'checkDate', label: 'Check Date', type: 'date' },
  { key: 'performedBy', label: 'Performed By' },
  { key: 'status', label: 'Status', type: 'select', options: ['pass', 'fail', 'warning'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function QualityControl() {
  return <CrudPage title="Quality Control" endpoint="/quality-control" columns={columns} formFields={formFields} detailFields={detailFields} />;
}
