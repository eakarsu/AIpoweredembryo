import { useState, useEffect } from 'react';
import API from '../services/api';
import AIAnalysisDisplay from '../components/AIAnalysisDisplay';
import { FiZap } from '../components/Icons';

export default function GeneticRiskAssess() {
  const [screenings, setScreenings] = useState([]);
  const [screeningId, setScreeningId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    API.get('/genetic-screenings')
      .then((r) => setScreenings(Array.isArray(r.data) ? r.data : []))
      .catch(() => setScreenings([]));
  }, []);

  const handleRun = async (e) => {
    e.preventDefault();
    setError('');
    if (!screeningId) {
      setError('Select a genetic screening');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await API.post(`/genetic-screenings/risk-assess/${screeningId}`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'AI analysis failed');
    }
    setLoading(false);
  };

  const selected = screenings.find((s) => String(s.id) === String(screeningId));

  return (
    <div>
      <div className="page-header">
        <h2>Genetic Risk Assessment</h2>
      </div>

      <div className="data-table-container" style={{ padding: 24, marginBottom: 24 }}>
        <form onSubmit={handleRun}>
          <div className="form-group">
            <label>Genetic Screening</label>
            <select
              className="form-control"
              value={screeningId}
              onChange={(e) => setScreeningId(e.target.value)}
              required
            >
              <option value="">Select a screening...</option>
              {screenings.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} &middot; {s.screeningType || s.testType || 'Screening'} &middot;{' '}
                  {s.screeningDate ? new Date(s.screeningDate).toLocaleDateString() : 'no date'}
                </option>
              ))}
            </select>
          </div>
          {selected && (
            <div
              style={{
                marginBottom: 16,
                background: '#0f172a',
                padding: 12,
                borderRadius: 6,
                fontSize: 13,
                color: '#cbd5e1',
              }}
            >
              <div>
                <strong>Type:</strong> {selected.screeningType || selected.testType || 'N/A'}
              </div>
              <div>
                <strong>Result:</strong> {selected.result || selected.pgtResult || 'N/A'}
              </div>
              <div>
                <strong>Status:</strong> {selected.status || 'N/A'}
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-info" disabled={loading}>
            <FiZap size={16} /> {loading ? 'Analyzing...' : 'Run Risk Assessment'}
          </button>
        </form>
      </div>

      {error && (
        <div
          className="data-table-container"
          style={{ padding: 16, background: '#7f1d1d', color: '#fecaca', marginBottom: 24 }}
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>AI is analyzing...
        </div>
      )}

      {result && (
        <div>
          {result.parsed && (
            <div className="data-table-container" style={{ padding: 24, marginBottom: 16 }}>
              <h3 style={{ marginTop: 0 }}>Risk Profile</h3>
              {result.parsed.overall_risk && (
                <div style={{ marginBottom: 8 }}>
                  <span className="badge badge-warning">
                    Overall risk: {result.parsed.overall_risk}
                  </span>
                </div>
              )}
              {Array.isArray(result.parsed.predispositions) &&
                result.parsed.predispositions.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <label
                      style={{
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: '#94a3b8',
                        display: 'block',
                        marginBottom: 4,
                      }}
                    >
                      Predispositions
                    </label>
                    <ul style={{ paddingLeft: 20 }}>
                      {result.parsed.predispositions.map((p, i) => (
                        <li key={i}>{typeof p === 'string' ? p : JSON.stringify(p)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              {Array.isArray(result.parsed.recommended_actions) &&
                result.parsed.recommended_actions.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <label
                      style={{
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: '#94a3b8',
                        display: 'block',
                        marginBottom: 4,
                      }}
                    >
                      Recommended Actions
                    </label>
                    <ul style={{ paddingLeft: 20 }}>
                      {result.parsed.recommended_actions.map((p, i) => (
                        <li key={i}>{typeof p === 'string' ? p : JSON.stringify(p)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              {result.parsed.counseling_summary && (
                <div style={{ marginTop: 12 }}>
                  <label
                    style={{
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#94a3b8',
                      display: 'block',
                      marginBottom: 4,
                    }}
                  >
                    Counseling Summary
                  </label>
                  <p style={{ color: '#cbd5e1' }}>
                    {typeof result.parsed.counseling_summary === 'string'
                      ? result.parsed.counseling_summary
                      : JSON.stringify(result.parsed.counseling_summary)}
                  </p>
                </div>
              )}
            </div>
          )}
          <AIAnalysisDisplay
            content={result.aiAnalysis || result.content || JSON.stringify(result, null, 2)}
            title="AI Risk Assessment"
          />
        </div>
      )}
    </div>
  );
}
