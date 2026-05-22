import { useEffect, useState } from 'react';
import API from '../services/api';

// NON-VIZ #2 — Grading Criteria Rules Editor (CRUD on morphology thresholds)
const empty = { stage: 'Blastocyst', metric: 'expansion', minValue: 0, maxValue: 6, grade: 'B', notes: '' };

export default function GradingRulesEditor() {
  const [rules, setRules] = useState([]);
  const [draft, setDraft] = useState({ ...empty });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/custom-views/grading-rules');
      setRules(data.data || []);
      setError(null);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editingId) {
        await API.put(`/custom-views/grading-rules/${editingId}`, draft);
      } else {
        await API.post('/custom-views/grading-rules', draft);
      }
      setDraft({ ...empty }); setEditingId(null);
      load();
    } catch (e) { setError(e.message); }
  };

  const edit = (r) => { setDraft({ ...r }); setEditingId(r.id); };
  const remove = async (id) => {
    if (!window.confirm('Delete this rule?')) return;
    try { await API.delete(`/custom-views/grading-rules/${id}`); load(); }
    catch (e) { setError(e.message); }
  };
  const cancel = () => { setDraft({ ...empty }); setEditingId(null); };

  const field = (k) => (e) => setDraft({ ...draft, [k]: e.target.value });

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <h3 style={{ margin: 0 }}>Grading Criteria Rules Editor</h3>
      <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>
        Configure morphology thresholds used by AI grading. Each rule maps a stage/metric range to a target grade.
      </p>

      {error && <div style={{ marginTop: 10, color: '#b00' }}>Error: {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr) auto', gap: 8, marginTop: 12, alignItems: 'center' }}>
        <input value={draft.stage} onChange={field('stage')} placeholder="Stage" style={inp} />
        <input value={draft.metric} onChange={field('metric')} placeholder="Metric" style={inp} />
        <input value={draft.minValue} onChange={field('minValue')} placeholder="Min" type="number" style={inp} />
        <input value={draft.maxValue} onChange={field('maxValue')} placeholder="Max" type="number" style={inp} />
        <input value={draft.grade} onChange={field('grade')} placeholder="Grade" style={inp} />
        <input value={draft.notes} onChange={field('notes')} placeholder="Notes" style={inp} />
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={save} style={btnPrimary}>{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button onClick={cancel} style={btnGhost}>Cancel</button>}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
            <th style={th}>Stage</th><th style={th}>Metric</th>
            <th style={th}>Min</th><th style={th}>Max</th>
            <th style={th}>Grade</th><th style={th}>Notes</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} style={{ padding: 14, textAlign: 'center', color: '#64748b' }}>Loading…</td></tr>
          ) : rules.length === 0 ? (
            <tr><td colSpan={7} style={{ padding: 14, textAlign: 'center', color: '#64748b' }}>No rules yet.</td></tr>
          ) : rules.map(r => (
            <tr key={r.id} style={{ borderTop: '1px solid #e2e8f0' }}>
              <td style={td}>{r.stage}</td>
              <td style={td}>{r.metric}</td>
              <td style={td}>{r.minValue}</td>
              <td style={td}>{r.maxValue}</td>
              <td style={td}><span style={{ background: '#0e7c66', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{r.grade}</span></td>
              <td style={td}>{r.notes}</td>
              <td style={td}>
                <button onClick={() => edit(r)} style={btnSm}>Edit</button>
                <button onClick={() => remove(r.id)} style={{ ...btnSm, marginLeft: 6, background: '#b91c1c' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inp = { padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 };
const th  = { padding: '8px', fontWeight: 600, color: '#475569' };
const td  = { padding: '8px', color: '#1e293b' };
const btnPrimary = { padding: '6px 12px', background: '#0e7c66', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' };
const btnGhost   = { padding: '6px 12px', background: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: 4, cursor: 'pointer' };
const btnSm      = { padding: '4px 10px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 };
