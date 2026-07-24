import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import AIAnalysisDisplay from '../components/AIAnalysisDisplay';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const getInsights = async () => {
    setLoadingInsights(true);
    try {
      const { data } = await API.get('/dashboard/ai-insights');
      setInsights(data.insights);
    } catch {
      setInsights('Failed to load AI insights.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const cards = [
    { label: 'Total Patients', value: stats.totalPatients || 0, color: '#6366f1', path: '/patients' },
    { label: 'Treatment Cycles', value: stats.totalCycles || 0, color: '#3b82f6', path: '/cycles' },
    { label: 'Active Cycles', value: stats.activeCycles || 0, color: '#10b981', path: '/cycles' },
    { label: 'Total Embryos', value: stats.totalEmbryos || 0, color: '#ec4899', path: '/embryos' },
    { label: 'Success Rate', value: `${stats.successRate || 0}%`, color: '#f59e0b', path: '/predictions' },
    { label: 'Upcoming Appointments', value: stats.upcomingAppointments || 0, color: '#8b5cf6', path: '/appointments' },
    { label: 'Doctors & Staff', value: stats.totalDoctors || 0, color: '#06b6d4', path: '/doctors' },
    { label: 'Pending Revenue', value: `$${(stats.pendingRevenue || 0).toLocaleString()}`, color: '#f97316', path: '/billing' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <button className="btn btn-primary" onClick={getInsights} disabled={loadingInsights}>
          {loadingInsights ? 'Generating...' : 'Get AI Insights'}
        </button>
      </div>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card" onClick={() => navigate(card.path)}>
            <div className="stat-card-icon" style={{ background: `${card.color}20`, color: card.color }}>
              <span style={{ fontSize: '24px' }}>{card.label.charAt(0)}</span>
            </div>
            <h3>{card.value}</h3>
            <p>{card.label}</p>
          </div>
        ))}
      </div>

      {insights && <AIAnalysisDisplay content={insights} title="AI Clinic Insights" />}
    </div>
  );
}
