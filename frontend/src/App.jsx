import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import TreatmentCycles from './pages/TreatmentCycles';
import Embryos from './pages/Embryos';
import AIScores from './pages/AIScores';
import Predictions from './pages/Predictions';
import Doctors from './pages/Doctors';
import LabResults from './pages/LabResults';
import GeneticScreenings from './pages/GeneticScreenings';
import TransferPlans from './pages/TransferPlans';
import QualityControl from './pages/QualityControl';
import AIReports from './pages/AIReports';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Layout from './components/Layout';
import './App.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="cycles" element={<TreatmentCycles />} />
          <Route path="embryos" element={<Embryos />} />
          <Route path="ai-scores" element={<AIScores />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="lab-results" element={<LabResults />} />
          <Route path="genetic-screenings" element={<GeneticScreenings />} />
          <Route path="transfer-plans" element={<TransferPlans />} />
          <Route path="quality-control" element={<QualityControl />} />
          <Route path="ai-reports" element={<AIReports />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
