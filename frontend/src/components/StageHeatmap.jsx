import { useEffect, useState } from 'react';
import API from '../services/api';

// VIZ #2 — Development Stage x Day Heatmap
export default function StageHeatmap() {
  const [state, setState] = useState({ loading: true, stages: [], days: [], matrix: [], error: null });

  useEffect(() => {
    let mounted = true;
    API.get('/custom-views/stage-heatmap')
      .then(({ data }) => { if (mounted) setState({ loading: false, stages: data.stages, days: data.days, matrix: data.matrix, error: null }); })
      .catch(err => { if (mounted) setState({ loading: false, stages: [], days: [], matrix: [], error: err.message }); });
    return () => { mounted = false; };
  }, []);

  if (state.loading) return <div style={{ padding: 16 }}>Loading stage heatmap…</div>;
  if (state.error)   return <div style={{ padding: 16, color: '#b00' }}>Error: {state.error}</div>;

  const flat = state.matrix.flat();
  const max = Math.max(1, ...flat);
  const cellColor = (v) => {
    if (v === 0) return '#f8fafc';
    const intensity = v / max;
    const r = Math.round(255 - intensity * 200);
    const g = Math.round(255 - intensity * 80);
    const b = Math.round(255 - intensity * 200);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <h3 style={{ margin: 0 }}>Development Stage × Day Heatmap</h3>
      <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>
        Embryo counts by morphological stage across culture days 1–6. Darker cells = higher density.
      </p>
      <table style={{ borderCollapse: 'separate', borderSpacing: 4, marginTop: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '4px 8px', color: '#64748b', fontWeight: 500 }}>Stage \\ Day</th>
            {state.days.map(d => (
              <th key={d} style={{ padding: '4px 8px', color: '#64748b', fontWeight: 500 }}>D{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.stages.map((stage, i) => (
            <tr key={stage}>
              <td style={{ padding: '4px 8px', fontWeight: 600, color: '#1e293b' }}>{stage}</td>
              {state.matrix[i].map((v, j) => (
                <td key={j} style={{
                  width: 48, height: 36, textAlign: 'center',
                  background: cellColor(v),
                  borderRadius: 4,
                  color: v / max > 0.5 ? '#fff' : '#1e293b',
                  fontWeight: 600,
                  fontSize: 13,
                }}>{v || ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
