import ReactMarkdown from 'react-markdown';

export default function AIAnalysisDisplay({ content, title = 'AI Analysis' }) {
  if (!content) return null;
  return (
    <div className="ai-analysis">
      <div className="ai-analysis-header">
        <span className="ai-badge">AI POWERED</span>
        <h4>{title}</h4>
      </div>
      <div className="ai-analysis-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
