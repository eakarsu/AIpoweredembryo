import { useState, useEffect } from 'react';
import API from '../services/api';
import AIAnalysisDisplay from '../components/AIAnalysisDisplay';
import { FiZap } from '../components/Icons';

export default function LabAnomalyDetect() {
  const [labs, setLabs] = useState([]);
  const [labId, setLabId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    API.get('/lab-results')
      .then((r) => setLabs(Array.isArray(r.data) ? r.data : []))
      .catch(() => setLabs([]));
  }, []);

  const handleRun = async (e) => {
    e.preventDefault();
    setError('');
    if (!labId) {
      setError('Select a lab result');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await API.post(`/lab-results/anomaly-detect/${labId}`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'AI analysis failed');
    }
    setLoading(false);
  };

  const selectedLab = labs.find((l) => String(l.id) === String(labId));

  return (
    <div>
      <div className="page-header">
        <h2>Lab Anomaly Detection</h2>
      </div>

      <div className="data-table-container" style={{ padding: 24, marginBottom: 24 }}>
        <form onSubmit={handleRun}>
          <div className="form-group">
            <label>Lab Result</label>
            <select
              className="form-control"
              value={labId}
              onChange={(e) => setLabId(e.target.value)}
              required
            >
              <option value="">Select a lab result...</option>
              {labs.map((l) => (
                <option key={l.id} value={l.id}>
                  #{l.id} &middot; {l.testType || 'Test'} &middot;{' '}
                  {l.testDate ? new Date(l.testDate).toLocaleDateString() : 'no date'}
                  {l.Patient ? ` (${l.Patient.firstName} ${l.Patient.lastName})` : ''}
                </option>
              ))}
            </select>
          </div>
          {selectedLab && (
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
                <strong>Result:</strong> {selectedLab.result || 'N/A'}
              </div>
              <div>
                <strong>Value:</strong> {selectedLab.value ?? 'N/A'} {selectedLab.unit || ''}
              </div>
              <div>
                <strong>Reference:</strong> {selectedLab.referenceRange || 'N/A'}
              </div>
              <div>
                <strong>Status:</strong> {selectedLab.status || 'N/A'}
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-info" disabled={loading}>
            <FiZap size={16} /> {loading ? 'Analyzing...' : 'Run Anomaly Detection'}
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
              <h3 style={{ marginTop: 0 }}>Findings</h3>
              {result.parsed.is_abnormal !== undefined && (
                <div style={{ marginBottom: 8 }}>
                  <span
                    className={`badge ${result.parsed.is_abnormal ? 'badge-danger' : 'badge-success'}`}
                  >
                    {result.parsed.is_abnormal ? 'ABNORMAL' : 'NORMAL'}
                  </span>
                  {result.parsed.urgency && (
                    <span className="badge badge-warning" style={{ marginLeft: 8 }}>
                      Urgency: {result.parsed.urgency}
                    </span>
                  )}
                </div>
              )}
              {result.parsed.clinical_interpretation && (
                <p style={{ color: '#cbd5e1' }}>{result.parsed.clinical_interpretation}</p>
              )}
              {result.parsed.ivf_implications && (
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
                    IVF Implications
                  </label>
                  <p style={{ color: '#cbd5e1' }}>
                    {typeof result.parsed.ivf_implications === 'string'
                      ? result.parsed.ivf_implications
                      : JSON.stringify(result.parsed.ivf_implications)}
                  </p>
                </div>
              )}
              {Array.isArray(result.parsed.follow_up_tests) && result.parsed.follow_up_tests.length > 0 && (
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
                    Follow-Up Tests
                  </label>
                  <ul style={{ paddingLeft: 20 }}>
                    {result.parsed.follow_up_tests.map((t, i) => (
                      <li key={i}>{typeof t === 'string' ? t : JSON.stringify(t)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <AIAnalysisDisplay
            content={result.aiAnalysis || result.content || JSON.stringify(result, null, 2)}
            title="AI Analysis"
          />
        </div>
      )}
    </div>
  );
}
