import { useEffect, useState } from 'react';
import API from '../services/api';

// VIZ #1 — Embryo Grade Distribution (horizontal bars rendered as plain divs)
export default function GradeDistributionChart() {
  const [state, setState] = useState({ loading: true, data: [], total: 0, error: null });

  useEffect(() => {
    let mounted = true;
    API.get('/custom-views/grade-distribution')
      .then(({ data }) => { if (mounted) setState({ loading: false, data: data.data || [], total: data.total || 0, error: null }); })
      .catch(err => { if (mounted) setState({ loading: false, data: [], total: 0, error: err.message }); });
    return () => { mounted = false; };
  }, []);

  if (state.loading) return <div style={{ padding: 16 }}>Loading grade distribution…</div>;
  if (state.error)   return <div style={{ padding: 16, color: '#b00' }}>Error: {state.error}</div>;

  const max = Math.max(1, ...state.data.map(d => d.count));
  const palette = ['#0e7c66', '#1b9e77', '#46b3a0', '#7dc4b6', '#a8d8cc', '#cde9e2', '#e9f5f1'];

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>Embryo Grade Distribution</h3>
        <span style={{ color: '#64748b', fontSize: 12 }}>n = {state.total}</span>
      </div>
      <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>
        Distribution of morphology grades across the embryo cohort (Gardner ICM/TE).
      </p>
      <div style={{ marginTop: 14 }}>
        {state.data.map((d, i) => (
          <div key={d.grade} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ width: 60, fontWeight: 600, color: '#1e293b' }}>{d.grade}</div>
            <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden', height: 22 }}>
              <div style={{
                width: `${(d.count / max) * 100}%`,
                height: '100%',
                background: palette[i % palette.length],
                transition: 'width 400ms ease',
              }} />
            </div>
            <div style={{ width: 50, textAlign: 'right', marginLeft: 10, color: '#334155' }}>{d.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
