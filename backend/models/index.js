const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'doctor', 'embryologist', 'nurse'), defaultValue: 'doctor' }
});

// Patient Model
const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  dateOfBirth: { type: DataTypes.DATEONLY },
  age: { type: DataTypes.INTEGER },
  bmi: { type: DataTypes.FLOAT },
  amhLevel: { type: DataTypes.FLOAT },
  fshLevel: { type: DataTypes.FLOAT },
  antralFollicleCount: { type: DataTypes.INTEGER },
  previousCycles: { type: DataTypes.INTEGER, defaultValue: 0 },
  previousPregnancies: { type: DataTypes.INTEGER, defaultValue: 0 },
  diagnosis: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('active', 'inactive', 'completed'), defaultValue: 'active' },
  notes: { type: DataTypes.TEXT }
});

// Treatment Cycle Model
const TreatmentCycle = sequelize.define('TreatmentCycle', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  cycleNumber: { type: DataTypes.INTEGER },
  cycleType: { type: DataTypes.ENUM('IVF', 'ICSI', 'FET', 'IUI', 'Natural'), defaultValue: 'IVF' },
  startDate: { type: DataTypes.DATEONLY },
  endDate: { type: DataTypes.DATEONLY },
  protocol: { type: DataTypes.STRING },
  stimDuration: { type: DataTypes.INTEGER },
  eggsRetrieved: { type: DataTypes.INTEGER },
  eggsMature: { type: DataTypes.INTEGER },
  eggsFertilized: { type: DataTypes.INTEGER },
  embryosCreated: { type: DataTypes.INTEGER },
  embryosTransferred: { type: DataTypes.INTEGER },
  outcome: { type: DataTypes.ENUM('pending', 'positive', 'negative', 'chemical', 'ectopic', 'miscarriage'), defaultValue: 'pending' },
  status: { type: DataTypes.ENUM('active', 'completed', 'cancelled'), defaultValue: 'active' },
  notes: { type: DataTypes.TEXT }
});

// Embryo Model
const Embryo = sequelize.define('Embryo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  cycleId: { type: DataTypes.INTEGER },
  embryoCode: { type: DataTypes.STRING },
  dayOfDevelopment: { type: DataTypes.INTEGER },
  cellCount: { type: DataTypes.INTEGER },
  fragmentation: { type: DataTypes.FLOAT },
  symmetry: { type: DataTypes.ENUM('equal', 'slightly_unequal', 'unequal'), defaultValue: 'equal' },
  gardnerGrade: { type: DataTypes.STRING },
  icmGrade: { type: DataTypes.ENUM('A', 'B', 'C', 'D') },
  teGrade: { type: DataTypes.ENUM('A', 'B', 'C', 'D') },
  expansionStage: { type: DataTypes.INTEGER },
  morphologyScore: { type: DataTypes.FLOAT },
  aiScore: { type: DataTypes.FLOAT },
  aiRecommendation: { type: DataTypes.TEXT },
  pgtResult: { type: DataTypes.ENUM('normal', 'abnormal', 'mosaic', 'pending', 'not_tested'), defaultValue: 'not_tested' },
  status: { type: DataTypes.ENUM('fresh', 'frozen', 'transferred', 'discarded', 'biopsied'), defaultValue: 'fresh' },
  imageUrl: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
});

// AI Embryo Score Model
const AIScore = sequelize.define('AIScore', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  embryoId: { type: DataTypes.INTEGER, allowNull: false },
  overallScore: { type: DataTypes.FLOAT },
  morphologyScore: { type: DataTypes.FLOAT },
  developmentScore: { type: DataTypes.FLOAT },
  implantationProbability: { type: DataTypes.FLOAT },
  recommendation: { type: DataTypes.TEXT },
  aiModelUsed: { type: DataTypes.STRING },
  analysisDetails: { type: DataTypes.JSONB },
  confidence: { type: DataTypes.FLOAT }
});

// Pregnancy Prediction Model
const PregnancyPrediction = sequelize.define('PregnancyPrediction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  cycleId: { type: DataTypes.INTEGER },
  embryoId: { type: DataTypes.INTEGER },
  successProbability: { type: DataTypes.FLOAT },
  factors: { type: DataTypes.JSONB },
  recommendation: { type: DataTypes.TEXT },
  aiModelUsed: { type: DataTypes.STRING },
  actualOutcome: { type: DataTypes.STRING }
});

// Doctor Model
const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  specialty: { type: DataTypes.STRING },
  licenseNumber: { type: DataTypes.STRING },
  experience: { type: DataTypes.INTEGER },
  successRate: { type: DataTypes.FLOAT },
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
  bio: { type: DataTypes.TEXT }
});

// Lab Result Model
const LabResult = sequelize.define('LabResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  cycleId: { type: DataTypes.INTEGER },
  testType: { type: DataTypes.STRING, allowNull: false },
  testDate: { type: DataTypes.DATEONLY },
  result: { type: DataTypes.STRING },
  value: { type: DataTypes.FLOAT },
  unit: { type: DataTypes.STRING },
  referenceRange: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('normal', 'abnormal', 'critical', 'pending'), defaultValue: 'pending' },
  notes: { type: DataTypes.TEXT }
});

// Genetic Screening Model
const GeneticScreening = sequelize.define('GeneticScreening', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  embryoId: { type: DataTypes.INTEGER, allowNull: false },
  patientId: { type: DataTypes.INTEGER },
  screeningType: { type: DataTypes.ENUM('PGT-A', 'PGT-M', 'PGT-SR', 'PGT-P'), defaultValue: 'PGT-A' },
  testDate: { type: DataTypes.DATEONLY },
  result: { type: DataTypes.ENUM('euploid', 'aneuploid', 'mosaic', 'no_result', 'pending'), defaultValue: 'pending' },
  chromosomeDetails: { type: DataTypes.JSONB },
  labName: { type: DataTypes.STRING },
  reportUrl: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
});

// Transfer Plan Model
const TransferPlan = sequelize.define('TransferPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  cycleId: { type: DataTypes.INTEGER },
  embryoId: { type: DataTypes.INTEGER },
  doctorId: { type: DataTypes.INTEGER },
  transferDate: { type: DataTypes.DATEONLY },
  transferType: { type: DataTypes.ENUM('fresh', 'frozen', 'natural'), defaultValue: 'fresh' },
  endometrialThickness: { type: DataTypes.FLOAT },
  progesteroneLevel: { type: DataTypes.FLOAT },
  estrogenLevel: { type: DataTypes.FLOAT },
  status: { type: DataTypes.ENUM('planned', 'completed', 'cancelled', 'postponed'), defaultValue: 'planned' },
  outcome: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
});

// Quality Control Model
const QualityControl = sequelize.define('QualityControl', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category: { type: DataTypes.STRING, allowNull: false },
  metric: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.FLOAT },
  target: { type: DataTypes.FLOAT },
  unit: { type: DataTypes.STRING },
  checkDate: { type: DataTypes.DATEONLY },
  performedBy: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('pass', 'fail', 'warning'), defaultValue: 'pass' },
  notes: { type: DataTypes.TEXT }
});

// AI Report Model
const AIReport = sequelize.define('AIReport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER },
  reportType: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT },
  aiAnalysis: { type: DataTypes.JSONB },
  generatedBy: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('draft', 'final', 'reviewed'), defaultValue: 'draft' }
});

// Appointment Model
const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER },
  appointmentDate: { type: DataTypes.DATE, allowNull: false },
  duration: { type: DataTypes.INTEGER, defaultValue: 30 },
  type: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'), defaultValue: 'scheduled' },
  notes: { type: DataTypes.TEXT }
});

// Billing Model
const Billing = sequelize.define('Billing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  cycleId: { type: DataTypes.INTEGER },
  description: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  tax: { type: DataTypes.FLOAT, defaultValue: 0 },
  total: { type: DataTypes.FLOAT },
  paymentMethod: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('pending', 'paid', 'overdue', 'refunded', 'partial'), defaultValue: 'pending' },
  dueDate: { type: DataTypes.DATEONLY },
  paidDate: { type: DataTypes.DATEONLY },
  invoiceNumber: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
});

// Associations
Patient.hasMany(TreatmentCycle, { foreignKey: 'patientId' });
TreatmentCycle.belongsTo(Patient, { foreignKey: 'patientId' });

Patient.hasMany(Embryo, { foreignKey: 'patientId' });
Embryo.belongsTo(Patient, { foreignKey: 'patientId' });

TreatmentCycle.hasMany(Embryo, { foreignKey: 'cycleId' });
Embryo.belongsTo(TreatmentCycle, { foreignKey: 'cycleId' });

Embryo.hasMany(AIScore, { foreignKey: 'embryoId' });
AIScore.belongsTo(Embryo, { foreignKey: 'embryoId' });

Patient.hasMany(PregnancyPrediction, { foreignKey: 'patientId' });
PregnancyPrediction.belongsTo(Patient, { foreignKey: 'patientId' });

Patient.hasMany(LabResult, { foreignKey: 'patientId' });
LabResult.belongsTo(Patient, { foreignKey: 'patientId' });

Embryo.hasMany(GeneticScreening, { foreignKey: 'embryoId' });
GeneticScreening.belongsTo(Embryo, { foreignKey: 'embryoId' });

Patient.hasMany(TransferPlan, { foreignKey: 'patientId' });
TransferPlan.belongsTo(Patient, { foreignKey: 'patientId' });

Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

Patient.hasMany(Billing, { foreignKey: 'patientId' });
Billing.belongsTo(Patient, { foreignKey: 'patientId' });

Patient.hasMany(AIReport, { foreignKey: 'patientId' });
AIReport.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = {
  sequelize,
  User,
  Patient,
  TreatmentCycle,
  Embryo,
  AIScore,
  PregnancyPrediction,
  Doctor,
  LabResult,
  GeneticScreening,
  TransferPlan,
  QualityControl,
  AIReport,
  Appointment,
  Billing
};
