import GradeDistributionChart from '../components/GradeDistributionChart';
import StageHeatmap from '../components/StageHeatmap';
import LabReportPDF from '../components/LabReportPDF';
import GradingRulesEditor from '../components/GradingRulesEditor';

export default function CustomViewsPage() {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, color: '#0f172a' }}>IVF Custom Views</h1>
        <p style={{ color: '#64748b', marginTop: 4 }}>
          Embryo grading analytics, development tracking, lab reporting, and morphology rule configuration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <GradeDistributionChart />
        <StageHeatmap />
      </div>

      <LabReportPDF />
      <GradingRulesEditor />
    </div>
  );
}
