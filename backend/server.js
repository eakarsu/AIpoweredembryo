const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/cycles', require('./routes/cycles'));
app.use('/api/embryos', require('./routes/embryos'));
app.use('/api/ai-scores', require('./routes/ai-scores'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/lab-results', require('./routes/lab-results'));
app.use('/api/genetic-screenings', require('./routes/genetic-screenings'));
app.use('/api/transfer-plans', require('./routes/transfer-plans'));
app.use('/api/quality-control', require('./routes/quality-control'));
app.use('/api/ai-reports', require('./routes/ai-reports'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/dashboard', require('./routes/dashboard'));
// Apply pass 5 — additive route registrations.
app.use('/api/lims', require('./routes/lims'));
app.use('/api/ehr', require('./routes/ehr'));
app.use('/api/lab-vendors', require('./routes/lab-vendors'));
app.use('/api/counseling', require('./routes/counseling'));
app.use('/api/audit-trail', require('./routes/audit-trail'));
app.use('/api/consent', require('./routes/consent'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

sequelize.sync({ alter: true }).then(() => {
  
// === Custom Feature Mounts (batch_06) ===
app.use('/api/cf-agentic-embryo-selection', require('./routes/customFeat01_AgenticEmbryoSelection'));
app.use('/api/cf-computer-vision-embryo-grading', require('./routes/customFeat02_ComputerVisionEmbryoGrading'));
app.use('/api/cf-implantation-probability', require('./routes/customFeat03_ImplantationProbability'));
app.use('/api/cf-genetic-disease-screening-assistant', require('./routes/customFeat04_GeneticDiseaseScreeningAssistant'));
app.use('/api/cf-cycle-protocol-optimization', require('./routes/customFeat05_CycleProtocolOptimization'));


// === Batch 06 Gaps & Frontend Mounts ===
app.use('/api/gap-ai-route-stubs-ai', require('./routes/gapFeat_ai_route_stubs_ai'));
app.use('/api/gap-embryos-without-exposed-embryo', require('./routes/gapFeat_embryos_without_exposed_embryo'));
app.use('/api/gap-genetic', require('./routes/gapFeat_genetic'));
app.use('/api/gap-lab', require('./routes/gapFeat_lab'));
app.use('/api/gap-lims-and-ehr-modules-exist-but-real-adapters-not-v', require('./routes/gapFeat_lims_and_ehr_modules_exist_but_real_adapters_not_v'));
app.use('/api/gap-limited-regulatory-compliance-tracking-depth-cap-c', require('./routes/gapFeat_limited_regulatory_compliance_tracking_depth_cap_c'));
app.use('/api/gap-no-webhooks-for-lab-events', require('./routes/gapFeat_no_webhooks_for_lab_events'));
app.use('/api/gap-no-notifications-module-grep-0', require('./routes/gapFeat_no_notifications_module_grep_0'));
app.use('/api/gap-no-mobile-app-for-embryologists', require('./routes/gapFeat_no_mobile_app_for_embryologists'));
app.use('/api/gap-limited-frontend-pages-15-for-21', require('./routes/gapFeat_limited_frontend_pages_15_for_21'));

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});
