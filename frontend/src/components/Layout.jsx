import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiActivity, FiTarget, FiCpu, FiTrendingUp, FiUserCheck, FiClipboard, FiDna, FiCalendar, FiCheckSquare, FiFileText, FiClock, FiDollarSign, FiLogOut } from './Icons';

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const links = [
    { section: 'Overview', items: [
      { to: '/', icon: <FiHome />, label: 'Dashboard' },
    ]},
    { section: 'Patient Care', items: [
      { to: '/patients', icon: <FiUsers />, label: 'Patients' },
      { to: '/cycles', icon: <FiActivity />, label: 'Treatment Cycles' },
      { to: '/appointments', icon: <FiClock />, label: 'Appointments' },
    ]},
    { section: 'Embryology', items: [
      { to: '/embryos', icon: <FiTarget />, label: 'Embryos' },
      { to: '/ai-scores', icon: <FiCpu />, label: 'AI Embryo Scores' },
      { to: '/genetic-screenings', icon: <FiDna />, label: 'Genetic Screening' },
      { to: '/transfer-plans', icon: <FiCalendar />, label: 'Transfer Plans' },
    ]},
    { section: 'AI & Analytics', items: [
      { to: '/predictions', icon: <FiTrendingUp />, label: 'Pregnancy Predictions' },
      { to: '/ai-reports', icon: <FiFileText />, label: 'AI Reports' },
      { to: '/lab-anomaly-detect', icon: <FiCpu />, label: 'Lab Anomaly Detect' },
      { to: '/genetic-risk-assess', icon: <FiDna />, label: 'Genetic Risk Assess' },
    ]},
    { section: 'Administration', items: [
      { to: '/doctors', icon: <FiUserCheck />, label: 'Doctors & Staff' },
      { to: '/lab-results', icon: <FiClipboard />, label: 'Lab Results' },
      { to: '/quality-control', icon: <FiCheckSquare />, label: 'Quality Control' },
      { to: '/billing', icon: <FiDollarSign />, label: 'Billing' },
    ]},
    { section: 'Custom Views', items: [
      { to: '/custom-views', icon: <FiFileText />, label: 'IVF Views' },
    ]},
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>EmbryoAI Pro</h1>
          <p>IVF Embryo Selection Platform</p>
        </div>
        <nav className="sidebar-nav">
          {links.map((group) => (
            <div key={group.section}>
              <div className="sidebar-section">{group.section}</div>
              {group.items.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-name">{user.name || 'User'}</div>
          <div className="sidebar-user-role">{user.role || 'Admin'}</div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
