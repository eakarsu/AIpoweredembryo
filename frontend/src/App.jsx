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
import LabAnomalyDetect from './pages/LabAnomalyDetect';
import GeneticRiskAssess from './pages/GeneticRiskAssess';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Layout from './components/Layout';
import './App.css';

// // === Batch 06 Gaps & Frontend Mounts ===
import CFAgenticEmbryoSelectionPage from './pages/CFAgenticEmbryoSelectionPage';
import CFComputerVisionEmbryoGradingPage from './pages/CFComputerVisionEmbryoGradingPage';
import CFImplantationProbabilityPage from './pages/CFImplantationProbabilityPage';
import CFGeneticDiseaseScreeningAssistantPage from './pages/CFGeneticDiseaseScreeningAssistantPage';
import CFCycleProtocolOptimizationPage from './pages/CFCycleProtocolOptimizationPage';
import GapAiRouteStubsAiPage from './pages/GapAiRouteStubsAiPage';
import GapEmbryosWithoutExposedEmbryoPage from './pages/GapEmbryosWithoutExposedEmbryoPage';
import GapGeneticPage from './pages/GapGeneticPage';
import GapLabPage from './pages/GapLabPage';
import GapLimsAndEhrModulesExistButRealAdaptersNotVPage from './pages/GapLimsAndEhrModulesExistButRealAdaptersNotVPage';
import GapLimitedRegulatoryComplianceTrackingDepthCapCPage from './pages/GapLimitedRegulatoryComplianceTrackingDepthCapCPage';
import GapNoWebhooksForLabEventsPage from './pages/GapNoWebhooksForLabEventsPage';
import GapNoNotificationsModuleGrep0Page from './pages/GapNoNotificationsModuleGrep0Page';
import GapNoMobileAppForEmbryologistsPage from './pages/GapNoMobileAppForEmbryologistsPage';
import GapLimitedFrontendPages15For21Page from './pages/GapLimitedFrontendPages15For21Page';
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
          <Route path="lab-anomaly-detect" element={<LabAnomalyDetect />} />
          <Route path="genetic-risk-assess" element={<GeneticRiskAssess />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      
          {/* // === Batch 06 Gaps & Frontend Mounts === */}
          <Route path="/cf-agentic-embryo-selection" element={<CFAgenticEmbryoSelectionPage />} />
          <Route path="/cf-computer-vision-embryo-grading" element={<CFComputerVisionEmbryoGradingPage />} />
          <Route path="/cf-implantation-probability" element={<CFImplantationProbabilityPage />} />
          <Route path="/cf-genetic-disease-screening-assistant" element={<CFGeneticDiseaseScreeningAssistantPage />} />
          <Route path="/cf-cycle-protocol-optimization" element={<CFCycleProtocolOptimizationPage />} />
          <Route path="/gap-ai-route-stubs-ai" element={<GapAiRouteStubsAiPage />} />
          <Route path="/gap-embryos-without-exposed-embryo" element={<GapEmbryosWithoutExposedEmbryoPage />} />
          <Route path="/gap-genetic" element={<GapGeneticPage />} />
          <Route path="/gap-lab" element={<GapLabPage />} />
          <Route path="/gap-lims-and-ehr-modules-exist-but-real-adapters-not-v" element={<GapLimsAndEhrModulesExistButRealAdaptersNotVPage />} />
          <Route path="/gap-limited-regulatory-compliance-tracking-depth-cap-c" element={<GapLimitedRegulatoryComplianceTrackingDepthCapCPage />} />
          <Route path="/gap-no-webhooks-for-lab-events" element={<GapNoWebhooksForLabEventsPage />} />
          <Route path="/gap-no-notifications-module-grep-0" element={<GapNoNotificationsModuleGrep0Page />} />
          <Route path="/gap-no-mobile-app-for-embryologists" element={<GapNoMobileAppForEmbryologistsPage />} />
          <Route path="/gap-limited-frontend-pages-15-for-21" element={<GapLimitedFrontendPages15For21Page />} />
        </Routes>
    </BrowserRouter>
  );
}
