import { useState, useEffect } from 'react';
import API from '../services/api';
import { FiPlus, FiEdit, FiTrash, FiX, FiArrowLeft, FiZap } from './Icons';
import AIAnalysisDisplay from './AIAnalysisDisplay';

export default function CrudPage({ title, endpoint, columns, formFields, detailFields, aiAction, aiLabel, aiIdField }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const load = () => {
    setLoading(true);
    API.get(endpoint).then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [endpoint]);

  const handleRowClick = (item) => {
    API.get(`${endpoint}/${item.id}`).then(r => { setSelected(r.data); setAiResult(''); }).catch(() => setSelected(item));
  };

  const openNew = () => {
    setEditing(null);
    setFormData({});
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormData({ ...item });
    setShowForm(true);
    setSelected(null);
  };

  const handleDelete = async (item) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`${endpoint}/${item.id}`);
      setSelected(null);
      load();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`${endpoint}/${editing.id}`, formData);
      } else {
        await API.post(endpoint, formData);
      }
      setShowForm(false);
      setFormData({});
      load();
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleAI = async (item) => {
    if (!aiAction) return;
    setAiLoading(true);
    try {
      const idValue = aiIdField ? item[aiIdField] : item.id;
      const { data } = await API.post(aiAction.replace(':id', idValue));
      setAiResult(data.aiAnalysis || JSON.stringify(data, null, 2));
    } catch (err) {
      setAiResult('AI analysis failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const getBadgeClass = (value) => {
    const v = String(value).toLowerCase();
    if (['active', 'normal', 'pass', 'positive', 'paid', 'completed', 'euploid', 'scheduled', 'fresh'].includes(v)) return 'badge-success';
    if (['pending', 'warning', 'partial', 'mosaic', 'planned'].includes(v)) return 'badge-warning';
    if (['inactive', 'fail', 'negative', 'abnormal', 'overdue', 'aneuploid', 'cancelled', 'discarded', 'critical'].includes(v)) return 'badge-danger';
    if (['frozen', 'draft', 'chemical'].includes(v)) return 'badge-info';
    return 'badge-secondary';
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  // Detail View
  if (selected) {
    const fields = detailFields || columns;
    return (
      <div>
        <div className="page-header">
          <button className="btn btn-secondary" onClick={() => setSelected(null)}><FiArrowLeft size={16}/> Back to List</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {aiAction && (
              <button className="btn btn-info" onClick={() => handleAI(selected)} disabled={aiLoading}>
                <FiZap size={16}/> {aiLoading ? 'Analyzing...' : (aiLabel || 'AI Analyze')}
              </button>
            )}
            <button className="btn btn-warning" onClick={() => openEdit(selected)}><FiEdit size={16}/> Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(selected)}><FiTrash size={16}/> Delete</button>
          </div>
        </div>
        <div className="detail-view">
          <div className="detail-header">
            <h3>{title} Details #{selected.id}</h3>
          </div>
          <div className="detail-body">
            <div className="detail-grid">
              {fields.map(f => {
                let val = selected[f.key];
                if (f.key.includes('.')) {
                  const parts = f.key.split('.');
                  val = selected[parts[0]]?.[parts[1]];
                }
                if (val && typeof val === 'object' && !Array.isArray(val)) val = JSON.stringify(val, null, 2);
                const isStatus = ['status', 'outcome', 'result', 'pgtResult'].includes(f.key);
                return (
                  <div className="detail-item" key={f.key}>
                    <label>{f.label}</label>
                    {isStatus ? <span className={`badge ${getBadgeClass(val)}`}>{val || 'N/A'}</span> : <span>{val ?? 'N/A'}</span>}
                  </div>
                );
              })}
            </div>
            {selected.notes && (
              <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', display: 'block', marginBottom: 4 }}>Notes</label>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>{selected.notes}</p>
              </div>
            )}
            {/* Show score bars for numeric scores */}
            {(selected.overallScore || selected.morphologyScore || selected.aiScore || selected.successProbability) && (
              <div style={{ marginTop: 20 }}>
                {['overallScore', 'morphologyScore', 'developmentScore', 'implantationProbability', 'aiScore', 'successProbability', 'confidence'].map(key => {
                  const val = selected[key];
                  if (!val) return null;
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                  return (
                    <div key={key} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: '#94a3b8' }}>{label}</span>
                        <span style={{ fontWeight: 700 }}>{typeof val === 'number' ? val.toFixed(1) : val}%</span>
                      </div>
                      <div className="score-bar">
                        <div className={`score-bar-fill ${val >= 70 ? 'score-high' : val >= 40 ? 'score-medium' : 'score-low'}`} style={{ width: `${Math.min(val, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {selected.recommendation && (
              <AIAnalysisDisplay content={selected.recommendation} title="AI Recommendation" />
            )}
            {selected.content && (
              <AIAnalysisDisplay content={selected.content} title="Report Content" />
            )}
          </div>
        </div>
        {aiResult && <AIAnalysisDisplay content={aiResult} title="AI Analysis Result" />}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>{title} ({items.length})</h2>
        <button className="btn btn-primary" onClick={openNew}><FiPlus size={16}/> New {title.replace(/s$/, '')}</button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(c => <th key={c.key}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} onClick={() => handleRowClick(item)}>
                {columns.map(c => {
                  let val = item[c.key];
                  if (c.key.includes('.')) {
                    const parts = c.key.split('.');
                    val = item[parts[0]]?.[parts[1]];
                  }
                  if (c.render) val = c.render(item);
                  const isStatus = ['status', 'outcome', 'result', 'pgtResult'].includes(c.key);
                  return (
                    <td key={c.key}>
                      {isStatus ? <span className={`badge ${getBadgeClass(val)}`}>{val || 'N/A'}</span> : (val ?? 'N/A')}
                    </td>
                  );
                })}
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit' : 'New'} {title.replace(/s$/, '')}</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formFields.map(f => (
                  <div className="form-group" key={f.key}>
                    <label>{f.label}</label>
                    {f.type === 'select' ? (
                      <select className="form-control" value={formData[f.key] || ''} onChange={e => updateField(f.key, e.target.value)}>
                        <option value="">Select...</option>
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea className="form-control" value={formData[f.key] || ''} onChange={e => updateField(f.key, e.target.value)} />
                    ) : (
                      <input type={f.type || 'text'} className="form-control" value={formData[f.key] || ''} onChange={e => updateField(f.key, e.target.value)} required={f.required} />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
