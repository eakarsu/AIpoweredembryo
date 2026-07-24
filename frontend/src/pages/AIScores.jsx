import CrudPage from '../components/CrudPage';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'embryoId', label: 'Embryo ID' },
  { key: 'overallScore', label: 'Overall', render: (i) => i.overallScore?.toFixed(1) },
  { key: 'morphologyScore', label: 'Morphology', render: (i) => i.morphologyScore?.toFixed(1) },
  { key: 'developmentScore', label: 'Development', render: (i) => i.developmentScore?.toFixed(1) },
  { key: 'implantationProbability', label: 'Implant Prob', render: (i) => `${i.implantationProbability?.toFixed(1)}%` },
  { key: 'confidence', label: 'Confidence', render: (i) => `${i.confidence?.toFixed(1)}%` },
  { key: 'aiModelUsed', label: 'Model' },
];

const detailFields = [
  { key: 'id', label: 'Score ID' },
  { key: 'embryoId', label: 'Embryo ID' },
  { key: 'overallScore', label: 'Overall Score' },
  { key: 'morphologyScore', label: 'Morphology Score' },
  { key: 'developmentScore', label: 'Development Score' },
  { key: 'implantationProbability', label: 'Implantation Probability' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'aiModelUsed', label: 'AI Model Used' },
  { key: 'analysisDetails', label: 'Analysis Details' },
];

const formFields = [
  { key: 'embryoId', label: 'Embryo ID', type: 'number', required: true },
  { key: 'overallScore', label: 'Overall Score', type: 'number' },
  { key: 'morphologyScore', label: 'Morphology Score', type: 'number' },
  { key: 'developmentScore', label: 'Development Score', type: 'number' },
  { key: 'implantationProbability', label: 'Implantation Probability', type: 'number' },
  { key: 'confidence', label: 'Confidence', type: 'number' },
  { key: 'recommendation', label: 'Recommendation', type: 'textarea' },
];

export default function AIScores() {
  return <CrudPage
    title="AI Embryo Scores"
    endpoint="/ai-scores"
    columns={columns}
    formFields={formFields}
    detailFields={detailFields}
    aiAction="/ai-scores/analyze/:id"
    aiLabel="AI Analyze Embryo"
    aiIdField="embryoId"
  />;
}
