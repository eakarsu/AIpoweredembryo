import { useState } from 'react';
import API from '../services/api';

// NON-VIZ #1 — Lab Report PDF generator (downloadable text-encoded PDF stub)
export default function LabReportPDF() {
  const [cycleId, setCycleId] = useState('LAB-2026-0518');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await API.get(`/custom-views/lab-report?cycleId=${encodeURIComponent(cycleId)}`);
      setReport(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!report) return;
    const blob = new Blob([report.preview], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `lab-report-${report.reportId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <h3 style={{ margin: 0 }}>Lab Report (PDF)</h3>
      <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>
        Generate a downloadable IVF laboratory report for a given cycle ID.
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={cycleId}
          onChange={(e) => setCycleId(e.target.value)}
          placeholder="Cycle ID"
          style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
        />
        <button onClick={generate} disabled={loading}
          style={{ padding: '8px 16px', background: '#0e7c66', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          {loading ? 'Generating…' : 'Generate'}
        </button>
        <button onClick={download} disabled={!report}
          style={{ padding: '8px 16px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: 6, cursor: report ? 'pointer' : 'not-allowed', opacity: report ? 1 : 0.5 }}>
          Download
        </button>
      </div>
      {error && <div style={{ marginTop: 10, color: '#b00' }}>Error: {error}</div>}
      {report && (
        <pre style={{
          marginTop: 14, padding: 14, background: '#0f172a', color: '#e2e8f0',
          borderRadius: 8, fontSize: 12, lineHeight: 1.45, overflow: 'auto', maxHeight: 360,
        }}>{report.preview}</pre>
      )}
    </div>
  );
}
