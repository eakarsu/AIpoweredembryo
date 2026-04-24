import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'invoiceNumber', label: 'Invoice #' },
  { key: 'Patient.firstName', label: 'Patient', render: (i) => i.Patient ? `${i.Patient.firstName} ${i.Patient.lastName}` : 'N/A' },
  { key: 'description', label: 'Description' },
  { key: 'total', label: 'Total', render: (i) => `$${(i.total || 0).toLocaleString()}` },
  { key: 'paymentMethod', label: 'Payment' },
  { key: 'status', label: 'Status' },
];

const detailFields = [
  { key: 'id', label: 'Billing ID' },
  { key: 'invoiceNumber', label: 'Invoice Number' },
  { key: 'patientId', label: 'Patient ID' },
  { key: 'cycleId', label: 'Cycle ID' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
  { key: 'tax', label: 'Tax' },
  { key: 'total', label: 'Total' },
  { key: 'paymentMethod', label: 'Payment Method' },
  { key: 'status', label: 'Status' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'paidDate', label: 'Paid Date' },
];

const formFields = [
  { key: 'patientId', label: 'Patient ID', type: 'number', required: true },
  { key: 'cycleId', label: 'Cycle ID', type: 'number' },
  { key: 'invoiceNumber', label: 'Invoice Number' },
  { key: 'description', label: 'Description', required: true },
  { key: 'amount', label: 'Amount', type: 'number', required: true },
  { key: 'tax', label: 'Tax', type: 'number' },
  { key: 'total', label: 'Total', type: 'number' },
  { key: 'paymentMethod', label: 'Payment Method' },
  { key: 'status', label: 'Status', type: 'select', options: ['pending', 'paid', 'overdue', 'refunded', 'partial'] },
  { key: 'dueDate', label: 'Due Date', type: 'date' },
  { key: 'paidDate', label: 'Paid Date', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export default function Billing() {
  return <CrudPage title="Billing" endpoint="/billing" columns={columns} formFields={formFields} detailFields={detailFields} />;
}
