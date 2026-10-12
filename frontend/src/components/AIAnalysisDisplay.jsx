import AIReport from './AIReport';

export default function AIAnalysisDisplay({ content, title = 'AI Analysis' }) {
  if (content === null || content === undefined || content === '') return null;
  return <AIReport response={content} title={title} />;
}
