require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User, Patient, TreatmentCycle, Embryo, AIScore, PregnancyPrediction, Doctor, LabResult, GeneticScreening, TransferPlan, QualityControl, AIReport, Appointment, Billing } = require('../models');

function requireDemoPassword() {
  const password = process.env.DEMO_PASSWORD || process.env.SEED_DEMO_PASSWORD || process.env.DEMO_SEED_PASSWORD || '';
  if (password.length < 12 || password.length > 1024) throw new Error('DEMO_PASSWORD must contain 12-1024 characters');
  return password;
}

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Users
    const hashedPassword = await bcrypt.hash(requireDemoPassword(), 10);
    await User.bulkCreate([
      { email: 'admin@ivfclinic.com', password: hashedPassword, name: 'Dr. Admin', role: 'admin' },
      { email: 'doctor@ivfclinic.com', password: hashedPassword, name: 'Dr. Sarah Chen', role: 'doctor' },
      { email: 'embryologist@ivfclinic.com', password: hashedPassword, name: 'Dr. James Wilson', role: 'embryologist' },
      { email: 'nurse@ivfclinic.com', password: hashedPassword, name: 'Nurse Emily Park', role: 'nurse' }
    ]);
    console.log('Users seeded');

    // Patients (15+)
    const patients = await Patient.bulkCreate([
      { firstName: 'Emma', lastName: 'Thompson', email: 'emma.t@email.com', phone: '555-0101', dateOfBirth: '1990-03-15', age: 34, bmi: 23.5, amhLevel: 3.2, fshLevel: 7.1, antralFollicleCount: 14, previousCycles: 1, previousPregnancies: 0, diagnosis: 'Unexplained infertility', status: 'active', notes: 'Good ovarian reserve' },
      { firstName: 'Sarah', lastName: 'Martinez', email: 'sarah.m@email.com', phone: '555-0102', dateOfBirth: '1988-07-22', age: 36, bmi: 25.1, amhLevel: 2.1, fshLevel: 8.5, antralFollicleCount: 10, previousCycles: 2, previousPregnancies: 1, diagnosis: 'Endometriosis Stage II', status: 'active', notes: 'Previous chemical pregnancy' },
      { firstName: 'Jessica', lastName: 'Chen', email: 'jessica.c@email.com', phone: '555-0103', dateOfBirth: '1992-11-08', age: 32, bmi: 21.8, amhLevel: 4.5, fshLevel: 6.2, antralFollicleCount: 18, previousCycles: 0, previousPregnancies: 0, diagnosis: 'Male factor infertility', status: 'active', notes: 'Partner has low sperm motility' },
      { firstName: 'Amanda', lastName: 'Williams', email: 'amanda.w@email.com', phone: '555-0104', dateOfBirth: '1985-01-30', age: 39, bmi: 27.3, amhLevel: 1.2, fshLevel: 11.2, antralFollicleCount: 6, previousCycles: 3, previousPregnancies: 0, diagnosis: 'Diminished ovarian reserve', status: 'active', notes: 'Consider donor eggs discussion' },
      { firstName: 'Rachel', lastName: 'Brown', email: 'rachel.b@email.com', phone: '555-0105', dateOfBirth: '1991-05-17', age: 33, bmi: 22.9, amhLevel: 3.8, fshLevel: 6.8, antralFollicleCount: 15, previousCycles: 1, previousPregnancies: 1, diagnosis: 'PCOS', status: 'active', notes: 'Responded well to letrozole' },
      { firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.a@email.com', phone: '555-0106', dateOfBirth: '1987-09-03', age: 37, bmi: 24.6, amhLevel: 1.8, fshLevel: 9.3, antralFollicleCount: 8, previousCycles: 2, previousPregnancies: 0, diagnosis: 'Tubal factor', status: 'active', notes: 'Bilateral tubal occlusion' },
      { firstName: 'Michelle', lastName: 'Davis', email: 'michelle.d@email.com', phone: '555-0107', dateOfBirth: '1993-02-14', age: 31, bmi: 20.5, amhLevel: 5.1, fshLevel: 5.9, antralFollicleCount: 20, previousCycles: 0, previousPregnancies: 0, diagnosis: 'Unexplained infertility', status: 'active', notes: 'Excellent ovarian reserve' },
      { firstName: 'Jennifer', lastName: 'Wilson', email: 'jennifer.w@email.com', phone: '555-0108', dateOfBirth: '1989-12-25', age: 35, bmi: 26.2, amhLevel: 2.5, fshLevel: 7.8, antralFollicleCount: 11, previousCycles: 1, previousPregnancies: 2, diagnosis: 'Secondary infertility', status: 'active', notes: 'Two previous live births naturally' },
      { firstName: 'Stephanie', lastName: 'Taylor', email: 'stephanie.t@email.com', phone: '555-0109', dateOfBirth: '1986-06-11', age: 38, bmi: 28.1, amhLevel: 1.5, fshLevel: 10.1, antralFollicleCount: 7, previousCycles: 3, previousPregnancies: 0, diagnosis: 'Endometriosis Stage III', status: 'active', notes: 'Post-laparoscopy' },
      { firstName: 'Nicole', lastName: 'Moore', email: 'nicole.m@email.com', phone: '555-0110', dateOfBirth: '1994-04-28', age: 30, bmi: 22.1, amhLevel: 4.8, fshLevel: 5.5, antralFollicleCount: 22, previousCycles: 0, previousPregnancies: 0, diagnosis: 'Male factor - azoospermia', status: 'active', notes: 'Using donor sperm' },
      { firstName: 'Katherine', lastName: 'Jackson', email: 'katherine.j@email.com', phone: '555-0111', dateOfBirth: '1990-08-19', age: 34, bmi: 23.8, amhLevel: 3.0, fshLevel: 7.5, antralFollicleCount: 13, previousCycles: 1, previousPregnancies: 0, diagnosis: 'Anovulation', status: 'active', notes: 'Clomid resistant' },
      { firstName: 'Lauren', lastName: 'White', email: 'lauren.w@email.com', phone: '555-0112', dateOfBirth: '1983-10-07', age: 41, bmi: 25.5, amhLevel: 0.8, fshLevel: 13.5, antralFollicleCount: 4, previousCycles: 4, previousPregnancies: 1, diagnosis: 'Advanced maternal age', status: 'active', notes: 'Considering PGT-A' },
      { firstName: 'Megan', lastName: 'Harris', email: 'megan.h@email.com', phone: '555-0113', dateOfBirth: '1992-01-23', age: 32, bmi: 21.3, amhLevel: 4.2, fshLevel: 6.0, antralFollicleCount: 17, previousCycles: 0, previousPregnancies: 0, diagnosis: 'Recurrent pregnancy loss', status: 'active', notes: 'Thrombophilia workup pending' },
      { firstName: 'Brittany', lastName: 'Clark', email: 'brittany.c@email.com', phone: '555-0114', dateOfBirth: '1988-11-12', age: 36, bmi: 24.0, amhLevel: 2.3, fshLevel: 8.2, antralFollicleCount: 9, previousCycles: 2, previousPregnancies: 1, diagnosis: 'Uterine fibroids', status: 'active', notes: 'Post myomectomy 6 months' },
      { firstName: 'Ashley', lastName: 'Lewis', email: 'ashley.l@email.com', phone: '555-0115', dateOfBirth: '1991-07-05', age: 33, bmi: 22.7, amhLevel: 3.5, fshLevel: 6.5, antralFollicleCount: 16, previousCycles: 1, previousPregnancies: 0, diagnosis: 'Unexplained infertility', status: 'active', notes: 'Previous failed IUI x3' },
      { firstName: 'Danielle', lastName: 'Robinson', email: 'danielle.r@email.com', phone: '555-0116', dateOfBirth: '1995-03-20', age: 29, bmi: 21.0, amhLevel: 5.5, fshLevel: 5.2, antralFollicleCount: 24, previousCycles: 0, previousPregnancies: 0, diagnosis: 'PCOS with anovulation', status: 'active', notes: 'High risk OHSS' }
    ]);
    console.log('Patients seeded');

    // Treatment Cycles (15+)
    const cycles = await TreatmentCycle.bulkCreate([
      { patientId: 1, cycleNumber: 1, cycleType: 'IVF', startDate: '2025-01-10', protocol: 'Long GnRH Agonist', stimDuration: 11, eggsRetrieved: 12, eggsMature: 10, eggsFertilized: 8, embryosCreated: 6, embryosTransferred: 1, outcome: 'pending', status: 'active', notes: 'Good response' },
      { patientId: 2, cycleNumber: 2, cycleType: 'ICSI', startDate: '2025-01-15', protocol: 'Antagonist', stimDuration: 10, eggsRetrieved: 8, eggsMature: 6, eggsFertilized: 5, embryosCreated: 4, embryosTransferred: 1, outcome: 'positive', status: 'completed', notes: 'Excellent fertilization rate' },
      { patientId: 3, cycleNumber: 1, cycleType: 'ICSI', startDate: '2025-02-01', protocol: 'Antagonist', stimDuration: 9, eggsRetrieved: 15, eggsMature: 12, eggsFertilized: 10, embryosCreated: 8, embryosTransferred: 1, outcome: 'pending', status: 'active', notes: 'ICSI due to male factor' },
      { patientId: 4, cycleNumber: 3, cycleType: 'IVF', startDate: '2025-02-10', protocol: 'Microdose Flare', stimDuration: 12, eggsRetrieved: 4, eggsMature: 3, eggsFertilized: 2, embryosCreated: 2, embryosTransferred: 2, outcome: 'negative', status: 'completed', notes: 'Poor response as expected' },
      { patientId: 5, cycleNumber: 1, cycleType: 'IVF', startDate: '2025-02-15', protocol: 'Antagonist', stimDuration: 8, eggsRetrieved: 18, eggsMature: 15, eggsFertilized: 12, embryosCreated: 9, embryosTransferred: 1, outcome: 'positive', status: 'completed', notes: 'PCOS - careful monitoring for OHSS' },
      { patientId: 6, cycleNumber: 2, cycleType: 'IVF', startDate: '2025-03-01', protocol: 'Long Agonist', stimDuration: 11, eggsRetrieved: 6, eggsMature: 5, eggsFertilized: 4, embryosCreated: 3, embryosTransferred: 1, outcome: 'pending', status: 'active', notes: 'Moderate response' },
      { patientId: 7, cycleNumber: 1, cycleType: 'IVF', startDate: '2025-03-05', protocol: 'Antagonist', stimDuration: 9, eggsRetrieved: 20, eggsMature: 16, eggsFertilized: 14, embryosCreated: 10, embryosTransferred: 1, outcome: 'positive', status: 'completed', notes: 'Excellent response' },
      { patientId: 8, cycleNumber: 1, cycleType: 'ICSI', startDate: '2025-03-10', protocol: 'Antagonist', stimDuration: 10, eggsRetrieved: 10, eggsMature: 8, eggsFertilized: 7, embryosCreated: 5, embryosTransferred: 1, outcome: 'pending', status: 'active', notes: 'Using ICSI for optimization' },
      { patientId: 9, cycleNumber: 3, cycleType: 'IVF', startDate: '2025-03-15', protocol: 'Short Agonist', stimDuration: 12, eggsRetrieved: 5, eggsMature: 4, eggsFertilized: 3, embryosCreated: 2, embryosTransferred: 1, outcome: 'chemical', status: 'completed', notes: 'Chemical pregnancy' },
      { patientId: 10, cycleNumber: 1, cycleType: 'ICSI', startDate: '2025-03-20', protocol: 'Antagonist', stimDuration: 8, eggsRetrieved: 22, eggsMature: 18, eggsFertilized: 15, embryosCreated: 11, embryosTransferred: 1, outcome: 'pending', status: 'active', notes: 'Donor sperm ICSI' },
      { patientId: 11, cycleNumber: 1, cycleType: 'IVF', startDate: '2025-04-01', protocol: 'Antagonist', stimDuration: 10, eggsRetrieved: 11, eggsMature: 9, eggsFertilized: 7, embryosCreated: 5, embryosTransferred: 1, outcome: 'pending', status: 'active', notes: 'First IVF attempt' },
      { patientId: 12, cycleNumber: 4, cycleType: 'IVF', startDate: '2025-04-05', protocol: 'Natural Modified', stimDuration: 3, eggsRetrieved: 2, eggsMature: 2, eggsFertilized: 1, embryosCreated: 1, embryosTransferred: 1, outcome: 'negative', status: 'completed', notes: 'Mini IVF attempt' },
      { patientId: 13, cycleNumber: 1, cycleType: 'IVF', startDate: '2025-04-10', protocol: 'Long Agonist', stimDuration: 11, eggsRetrieved: 14, eggsMature: 11, eggsFertilized: 9, embryosCreated: 7, embryosTransferred: 0, outcome: 'pending', status: 'active', notes: 'Freeze all - PGT-A planned' },
      { patientId: 14, cycleNumber: 2, cycleType: 'FET', startDate: '2025-04-15', protocol: 'HRT', stimDuration: 0, eggsRetrieved: 0, eggsMature: 0, eggsFertilized: 0, embryosCreated: 0, embryosTransferred: 1, outcome: 'positive', status: 'completed', notes: 'Frozen embryo transfer' },
      { patientId: 15, cycleNumber: 1, cycleType: 'IVF', startDate: '2025-04-20', protocol: 'Antagonist', stimDuration: 10, eggsRetrieved: 13, eggsMature: 10, eggsFertilized: 8, embryosCreated: 6, embryosTransferred: 1, outcome: 'pending', status: 'active', notes: 'Post failed IUI conversion' },
      { patientId: 16, cycleNumber: 1, cycleType: 'IVF', startDate: '2025-04-25', protocol: 'Antagonist Low-dose', stimDuration: 9, eggsRetrieved: 25, eggsMature: 20, eggsFertilized: 16, embryosCreated: 12, embryosTransferred: 0, outcome: 'pending', status: 'active', notes: 'Coasting used - OHSS risk' }
    ]);
    console.log('Treatment Cycles seeded');

    // Embryos (15+)
    const embryos = await Embryo.bulkCreate([
      { patientId: 1, cycleId: 1, embryoCode: 'EMB-001-A', dayOfDevelopment: 5, cellCount: 120, fragmentation: 5, symmetry: 'equal', gardnerGrade: '4AA', icmGrade: 'A', teGrade: 'A', expansionStage: 4, morphologyScore: 95, aiScore: 92, pgtResult: 'normal', status: 'fresh', notes: 'Top quality blastocyst' },
      { patientId: 1, cycleId: 1, embryoCode: 'EMB-001-B', dayOfDevelopment: 5, cellCount: 100, fragmentation: 10, symmetry: 'equal', gardnerGrade: '4AB', icmGrade: 'A', teGrade: 'B', expansionStage: 4, morphologyScore: 85, aiScore: 84, pgtResult: 'normal', status: 'frozen', notes: 'Good quality' },
      { patientId: 2, cycleId: 2, embryoCode: 'EMB-002-A', dayOfDevelopment: 5, cellCount: 110, fragmentation: 8, symmetry: 'equal', gardnerGrade: '3AA', icmGrade: 'A', teGrade: 'A', expansionStage: 3, morphologyScore: 90, aiScore: 88, pgtResult: 'normal', status: 'transferred', notes: 'Transferred successfully' },
      { patientId: 3, cycleId: 3, embryoCode: 'EMB-003-A', dayOfDevelopment: 5, cellCount: 130, fragmentation: 3, symmetry: 'equal', gardnerGrade: '5AA', icmGrade: 'A', teGrade: 'A', expansionStage: 5, morphologyScore: 98, aiScore: 96, pgtResult: 'normal', status: 'fresh', notes: 'Hatching blastocyst - exceptional' },
      { patientId: 3, cycleId: 3, embryoCode: 'EMB-003-B', dayOfDevelopment: 5, cellCount: 95, fragmentation: 12, symmetry: 'slightly_unequal', gardnerGrade: '3BB', icmGrade: 'B', teGrade: 'B', expansionStage: 3, morphologyScore: 72, aiScore: 70, pgtResult: 'pending', status: 'frozen', notes: 'Average quality' },
      { patientId: 4, cycleId: 4, embryoCode: 'EMB-004-A', dayOfDevelopment: 3, cellCount: 8, fragmentation: 20, symmetry: 'unequal', gardnerGrade: 'N/A', icmGrade: 'C', teGrade: 'C', expansionStage: 0, morphologyScore: 55, aiScore: 48, pgtResult: 'abnormal', status: 'discarded', notes: 'Poor quality cleavage stage' },
      { patientId: 5, cycleId: 5, embryoCode: 'EMB-005-A', dayOfDevelopment: 5, cellCount: 115, fragmentation: 6, symmetry: 'equal', gardnerGrade: '4AA', icmGrade: 'A', teGrade: 'A', expansionStage: 4, morphologyScore: 93, aiScore: 91, pgtResult: 'normal', status: 'transferred', notes: 'Selected for transfer' },
      { patientId: 5, cycleId: 5, embryoCode: 'EMB-005-B', dayOfDevelopment: 5, cellCount: 105, fragmentation: 9, symmetry: 'equal', gardnerGrade: '4BA', icmGrade: 'B', teGrade: 'A', expansionStage: 4, morphologyScore: 82, aiScore: 80, pgtResult: 'normal', status: 'frozen', notes: 'Good backup embryo' },
      { patientId: 7, cycleId: 7, embryoCode: 'EMB-007-A', dayOfDevelopment: 5, cellCount: 125, fragmentation: 4, symmetry: 'equal', gardnerGrade: '5AA', icmGrade: 'A', teGrade: 'A', expansionStage: 5, morphologyScore: 97, aiScore: 95, pgtResult: 'normal', status: 'transferred', notes: 'Exceptional hatching blast' },
      { patientId: 7, cycleId: 7, embryoCode: 'EMB-007-B', dayOfDevelopment: 5, cellCount: 100, fragmentation: 7, symmetry: 'equal', gardnerGrade: '4AB', icmGrade: 'A', teGrade: 'B', expansionStage: 4, morphologyScore: 86, aiScore: 83, pgtResult: 'normal', status: 'frozen', notes: 'Frozen for future use' },
      { patientId: 10, cycleId: 10, embryoCode: 'EMB-010-A', dayOfDevelopment: 5, cellCount: 118, fragmentation: 5, symmetry: 'equal', gardnerGrade: '4AA', icmGrade: 'A', teGrade: 'A', expansionStage: 4, morphologyScore: 94, aiScore: 92, pgtResult: 'normal', status: 'fresh', notes: 'Donor sperm - excellent quality' },
      { patientId: 10, cycleId: 10, embryoCode: 'EMB-010-B', dayOfDevelopment: 5, cellCount: 90, fragmentation: 15, symmetry: 'slightly_unequal', gardnerGrade: '3BC', icmGrade: 'B', teGrade: 'C', expansionStage: 3, morphologyScore: 65, aiScore: 60, pgtResult: 'mosaic', status: 'frozen', notes: 'Mosaic result - discuss with patient' },
      { patientId: 13, cycleId: 13, embryoCode: 'EMB-013-A', dayOfDevelopment: 5, cellCount: 112, fragmentation: 6, symmetry: 'equal', gardnerGrade: '4AA', icmGrade: 'A', teGrade: 'A', expansionStage: 4, morphologyScore: 92, aiScore: 90, pgtResult: 'pending', status: 'biopsied', notes: 'PGT-A biopsy taken' },
      { patientId: 13, cycleId: 13, embryoCode: 'EMB-013-B', dayOfDevelopment: 5, cellCount: 108, fragmentation: 8, symmetry: 'equal', gardnerGrade: '3AB', icmGrade: 'A', teGrade: 'B', expansionStage: 3, morphologyScore: 84, aiScore: 81, pgtResult: 'pending', status: 'biopsied', notes: 'PGT-A biopsy taken' },
      { patientId: 15, cycleId: 15, embryoCode: 'EMB-015-A', dayOfDevelopment: 5, cellCount: 110, fragmentation: 7, symmetry: 'equal', gardnerGrade: '4AB', icmGrade: 'A', teGrade: 'B', expansionStage: 4, morphologyScore: 87, aiScore: 85, pgtResult: 'not_tested', status: 'fresh', notes: 'Ready for transfer' },
      { patientId: 16, cycleId: 16, embryoCode: 'EMB-016-A', dayOfDevelopment: 5, cellCount: 128, fragmentation: 4, symmetry: 'equal', gardnerGrade: '5AA', icmGrade: 'A', teGrade: 'A', expansionStage: 5, morphologyScore: 96, aiScore: 94, pgtResult: 'normal', status: 'frozen', notes: 'Top quality - freeze all cycle' }
    ]);
    console.log('Embryos seeded');

    // AI Scores (15+)
    await AIScore.bulkCreate([
      { embryoId: 1, overallScore: 92, morphologyScore: 95, developmentScore: 90, implantationProbability: 72, recommendation: 'Highest priority for transfer. Excellent morphology and development.', aiModelUsed: 'claude-haiku-4.5', confidence: 94, analysisDetails: { grade: '4AA', risk: 'low' } },
      { embryoId: 2, overallScore: 84, morphologyScore: 85, developmentScore: 82, implantationProbability: 58, recommendation: 'Good candidate for transfer or cryopreservation.', aiModelUsed: 'claude-haiku-4.5', confidence: 88, analysisDetails: { grade: '4AB', risk: 'low' } },
      { embryoId: 3, overallScore: 88, morphologyScore: 90, developmentScore: 86, implantationProbability: 65, recommendation: 'Excellent transfer candidate with high implantation potential.', aiModelUsed: 'claude-haiku-4.5', confidence: 91, analysisDetails: { grade: '3AA', risk: 'low' } },
      { embryoId: 4, overallScore: 96, morphologyScore: 98, developmentScore: 95, implantationProbability: 78, recommendation: 'Exceptional embryo - top priority. Hatching blastocyst with perfect morphology.', aiModelUsed: 'claude-haiku-4.5', confidence: 97, analysisDetails: { grade: '5AA', risk: 'very_low' } },
      { embryoId: 5, overallScore: 70, morphologyScore: 72, developmentScore: 68, implantationProbability: 38, recommendation: 'Average quality. Consider for transfer only if no better options available.', aiModelUsed: 'claude-haiku-4.5', confidence: 82, analysisDetails: { grade: '3BB', risk: 'medium' } },
      { embryoId: 6, overallScore: 48, morphologyScore: 55, developmentScore: 42, implantationProbability: 15, recommendation: 'Poor quality. Not recommended for transfer. Genetic abnormality detected.', aiModelUsed: 'claude-haiku-4.5', confidence: 90, analysisDetails: { grade: 'N/A', risk: 'high' } },
      { embryoId: 7, overallScore: 91, morphologyScore: 93, developmentScore: 89, implantationProbability: 70, recommendation: 'Excellent candidate. Strong implantation potential.', aiModelUsed: 'claude-haiku-4.5', confidence: 93, analysisDetails: { grade: '4AA', risk: 'low' } },
      { embryoId: 8, overallScore: 80, morphologyScore: 82, developmentScore: 78, implantationProbability: 52, recommendation: 'Good backup embryo for future FET cycles.', aiModelUsed: 'claude-haiku-4.5', confidence: 86, analysisDetails: { grade: '4BA', risk: 'low' } },
      { embryoId: 9, overallScore: 95, morphologyScore: 97, developmentScore: 93, implantationProbability: 76, recommendation: 'Outstanding embryo. Highest transfer priority.', aiModelUsed: 'claude-haiku-4.5', confidence: 96, analysisDetails: { grade: '5AA', risk: 'very_low' } },
      { embryoId: 10, overallScore: 83, morphologyScore: 86, developmentScore: 81, implantationProbability: 56, recommendation: 'Good quality for cryopreservation and future use.', aiModelUsed: 'claude-haiku-4.5', confidence: 87, analysisDetails: { grade: '4AB', risk: 'low' } },
      { embryoId: 11, overallScore: 92, morphologyScore: 94, developmentScore: 90, implantationProbability: 71, recommendation: 'Top tier embryo with excellent implantation probability.', aiModelUsed: 'claude-haiku-4.5', confidence: 94, analysisDetails: { grade: '4AA', risk: 'low' } },
      { embryoId: 12, overallScore: 60, morphologyScore: 65, developmentScore: 55, implantationProbability: 25, recommendation: 'Mosaic result requires genetic counseling. Consider cautiously.', aiModelUsed: 'claude-haiku-4.5', confidence: 78, analysisDetails: { grade: '3BC', risk: 'high' } },
      { embryoId: 13, overallScore: 90, morphologyScore: 92, developmentScore: 88, implantationProbability: 68, recommendation: 'Excellent candidate pending PGT-A results.', aiModelUsed: 'claude-haiku-4.5', confidence: 85, analysisDetails: { grade: '4AA', risk: 'pending' } },
      { embryoId: 14, overallScore: 81, morphologyScore: 84, developmentScore: 79, implantationProbability: 54, recommendation: 'Good secondary candidate pending genetic screening.', aiModelUsed: 'claude-haiku-4.5', confidence: 83, analysisDetails: { grade: '3AB', risk: 'pending' } },
      { embryoId: 15, overallScore: 85, morphologyScore: 87, developmentScore: 83, implantationProbability: 60, recommendation: 'Strong transfer candidate. Ready for fresh transfer.', aiModelUsed: 'claude-haiku-4.5', confidence: 89, analysisDetails: { grade: '4AB', risk: 'low' } },
      { embryoId: 16, overallScore: 94, morphologyScore: 96, developmentScore: 92, implantationProbability: 75, recommendation: 'Exceptional quality. Top priority for future FET.', aiModelUsed: 'claude-haiku-4.5', confidence: 95, analysisDetails: { grade: '5AA', risk: 'very_low' } }
    ]);
    console.log('AI Scores seeded');

    // Pregnancy Predictions (15+)
    await PregnancyPrediction.bulkCreate([
      { patientId: 1, cycleId: 1, embryoId: 1, successProbability: 62, factors: { age: 34, bmi: 23.5, amh: 3.2, embryoGrade: '4AA' }, recommendation: 'Good prognosis. Young age and excellent embryo quality favor success.', aiModelUsed: 'claude-haiku-4.5' },
      { patientId: 2, cycleId: 2, embryoId: 3, successProbability: 55, factors: { age: 36, bmi: 25.1, amh: 2.1, embryoGrade: '3AA' }, recommendation: 'Moderate success probability. Endometriosis may impact implantation.', aiModelUsed: 'claude-haiku-4.5', actualOutcome: 'positive' },
      { patientId: 3, cycleId: 3, embryoId: 4, successProbability: 75, factors: { age: 32, bmi: 21.8, amh: 4.5, embryoGrade: '5AA' }, recommendation: 'Excellent prognosis. Top quality embryo with young maternal age.', aiModelUsed: 'claude-haiku-4.5' },
      { patientId: 4, cycleId: 4, embryoId: 6, successProbability: 18, factors: { age: 39, bmi: 27.3, amh: 1.2, embryoGrade: 'poor' }, recommendation: 'Low probability. Consider donor eggs for improved outcomes.', aiModelUsed: 'claude-haiku-4.5', actualOutcome: 'negative' },
      { patientId: 5, cycleId: 5, embryoId: 7, successProbability: 68, factors: { age: 33, bmi: 22.9, amh: 3.8, embryoGrade: '4AA' }, recommendation: 'Favorable prognosis despite PCOS diagnosis. Excellent embryo selected.', aiModelUsed: 'claude-haiku-4.5', actualOutcome: 'positive' },
      { patientId: 6, cycleId: 6, successProbability: 42, factors: { age: 37, bmi: 24.6, amh: 1.8, embryoGrade: 'pending' }, recommendation: 'Moderate-low probability. Tubal factor may improve with direct transfer.', aiModelUsed: 'claude-haiku-4.5' },
      { patientId: 7, cycleId: 7, embryoId: 9, successProbability: 78, factors: { age: 31, bmi: 20.5, amh: 5.1, embryoGrade: '5AA' }, recommendation: 'Excellent prognosis. Young age, exceptional embryo, and good uterine environment.', aiModelUsed: 'claude-haiku-4.5', actualOutcome: 'positive' },
      { patientId: 8, cycleId: 8, successProbability: 52, factors: { age: 35, bmi: 26.2, amh: 2.5, embryoGrade: 'pending' }, recommendation: 'Average probability. Previous pregnancies are a positive indicator.', aiModelUsed: 'claude-haiku-4.5' },
      { patientId: 9, cycleId: 9, successProbability: 28, factors: { age: 38, bmi: 28.1, amh: 1.5, embryoGrade: 'average' }, recommendation: 'Below average probability. Multiple failed cycles impact prognosis.', aiModelUsed: 'claude-haiku-4.5', actualOutcome: 'chemical' },
      { patientId: 10, cycleId: 10, embryoId: 11, successProbability: 72, factors: { age: 30, bmi: 22.1, amh: 4.8, embryoGrade: '4AA' }, recommendation: 'Very good prognosis. Donor sperm eliminates male factor.', aiModelUsed: 'claude-haiku-4.5' },
      { patientId: 11, cycleId: 11, successProbability: 58, factors: { age: 34, bmi: 23.8, amh: 3.0, embryoGrade: 'pending' }, recommendation: 'Good probability for first IVF cycle. Anovulation well managed.', aiModelUsed: 'claude-haiku-4.5' },
      { patientId: 12, cycleId: 12, successProbability: 12, factors: { age: 41, bmi: 25.5, amh: 0.8, embryoGrade: 'low' }, recommendation: 'Low probability due to age and diminished reserve. Donor options recommended.', aiModelUsed: 'claude-haiku-4.5', actualOutcome: 'negative' },
      { patientId: 13, cycleId: 13, embryoId: 13, successProbability: 65, factors: { age: 32, bmi: 21.3, amh: 4.2, embryoGrade: '4AA' }, recommendation: 'Good prognosis pending PGT-A. RPL workup should guide transfer protocol.', aiModelUsed: 'claude-haiku-4.5' },
      { patientId: 14, cycleId: 14, successProbability: 50, factors: { age: 36, bmi: 24.0, amh: 2.3, embryoGrade: 'good' }, recommendation: 'Moderate probability. Post myomectomy uterine environment assessment needed.', aiModelUsed: 'claude-haiku-4.5', actualOutcome: 'positive' },
      { patientId: 15, cycleId: 15, embryoId: 15, successProbability: 60, factors: { age: 33, bmi: 22.7, amh: 3.5, embryoGrade: '4AB' }, recommendation: 'Good probability. IVF may succeed where IUI did not.', aiModelUsed: 'claude-haiku-4.5' },
      { patientId: 16, cycleId: 16, embryoId: 16, successProbability: 74, factors: { age: 29, bmi: 21.0, amh: 5.5, embryoGrade: '5AA' }, recommendation: 'Excellent prognosis. Very young with top-quality embryos.', aiModelUsed: 'claude-haiku-4.5' }
    ]);
    console.log('Pregnancy Predictions seeded');

    // Doctors (15+)
    await Doctor.bulkCreate([
      { firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@ivfclinic.com', phone: '555-1001', specialty: 'Reproductive Endocrinology', licenseNumber: 'RE-2015-001', experience: 15, successRate: 68.5, status: 'active', bio: 'Board-certified RE with expertise in poor responders and recurrent implantation failure.' },
      { firstName: 'James', lastName: 'Wilson', email: 'james.wilson@ivfclinic.com', phone: '555-1002', specialty: 'Clinical Embryology', licenseNumber: 'CE-2010-002', experience: 20, successRate: 72.3, status: 'active', bio: 'Senior embryologist with pioneering work in time-lapse monitoring.' },
      { firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@ivfclinic.com', phone: '555-1003', specialty: 'Reproductive Surgery', licenseNumber: 'RS-2012-003', experience: 18, successRate: 65.8, status: 'active', bio: 'Expert in minimally invasive reproductive surgery and endometriosis.' },
      { firstName: 'Robert', lastName: 'Kim', email: 'robert.kim@ivfclinic.com', phone: '555-1004', specialty: 'Andrology', licenseNumber: 'AN-2014-004', experience: 12, successRate: 61.2, status: 'active', bio: 'Specializes in male factor infertility and surgical sperm retrieval.' },
      { firstName: 'Emily', lastName: 'Park', email: 'emily.park@ivfclinic.com', phone: '555-1005', specialty: 'Reproductive Genetics', licenseNumber: 'RG-2016-005', experience: 10, successRate: 70.1, status: 'active', bio: 'Genetic counselor with expertise in PGT and inherited conditions.' },
      { firstName: 'David', lastName: 'Thompson', email: 'david.thompson@ivfclinic.com', phone: '555-1006', specialty: 'Reproductive Endocrinology', licenseNumber: 'RE-2011-006', experience: 19, successRate: 67.9, status: 'active', bio: 'Focuses on PCOS management and ovulation induction protocols.' },
      { firstName: 'Anna', lastName: 'Petrov', email: 'anna.petrov@ivfclinic.com', phone: '555-1007', specialty: 'Clinical Embryology', licenseNumber: 'CE-2013-007', experience: 14, successRate: 69.4, status: 'active', bio: 'Specializes in vitrification and frozen embryo transfer outcomes.' },
      { firstName: 'Michael', lastName: 'O\'Brien', email: 'michael.obrien@ivfclinic.com', phone: '555-1008', specialty: 'Reproductive Endocrinology', licenseNumber: 'RE-2017-008', experience: 9, successRate: 63.7, status: 'active', bio: 'Young attending with focus on personalized IVF protocols.' },
      { firstName: 'Linda', lastName: 'Zhang', email: 'linda.zhang@ivfclinic.com', phone: '555-1009', specialty: 'Reproductive Immunology', licenseNumber: 'RI-2015-009', experience: 11, successRate: 66.2, status: 'active', bio: 'Expert in immunological factors affecting implantation.' },
      { firstName: 'Thomas', lastName: 'Brown', email: 'thomas.brown@ivfclinic.com', phone: '555-1010', specialty: 'Ultrasound Specialist', licenseNumber: 'US-2012-010', experience: 16, successRate: 64.5, status: 'active', bio: 'Advanced imaging specialist for follicular monitoring.' },
      { firstName: 'Patricia', lastName: 'Singh', email: 'patricia.singh@ivfclinic.com', phone: '555-1011', specialty: 'Reproductive Psychology', licenseNumber: 'RP-2018-011', experience: 8, successRate: 0, status: 'active', bio: 'Provides psychological support for fertility patients.' },
      { firstName: 'Richard', lastName: 'Nguyen', email: 'richard.nguyen@ivfclinic.com', phone: '555-1012', specialty: 'Laboratory Director', licenseNumber: 'LD-2009-012', experience: 22, successRate: 71.8, status: 'active', bio: 'IVF lab director with focus on quality metrics and continuous improvement.' },
      { firstName: 'Susan', lastName: 'Patel', email: 'susan.patel@ivfclinic.com', phone: '555-1013', specialty: 'Reproductive Endocrinology', licenseNumber: 'RE-2019-013', experience: 7, successRate: 62.1, status: 'active', bio: 'Specializes in fertility preservation and oncofertility.' },
      { firstName: 'William', lastName: 'Lee', email: 'william.lee@ivfclinic.com', phone: '555-1014', specialty: 'Reproductive Surgery', licenseNumber: 'RS-2014-014', experience: 13, successRate: 66.8, status: 'active', bio: 'Expert in hysteroscopy and uterine anomaly correction.' },
      { firstName: 'Karen', lastName: 'Adams', email: 'karen.adams@ivfclinic.com', phone: '555-1015', specialty: 'Nurse Practitioner', licenseNumber: 'NP-2016-015', experience: 10, successRate: 0, status: 'active', bio: 'IVF nurse coordinator managing patient care pathways.' },
      { firstName: 'Christopher', lastName: 'Taylor', email: 'chris.taylor@ivfclinic.com', phone: '555-1016', specialty: 'Reproductive Endocrinology', licenseNumber: 'RE-2020-016', experience: 6, successRate: 59.5, status: 'inactive', bio: 'Currently on sabbatical for research fellowship.' }
    ]);
    console.log('Doctors seeded');

    // Lab Results (15+)
    await LabResult.bulkCreate([
      { patientId: 1, cycleId: 1, testType: 'AMH', testDate: '2025-01-05', result: '3.2 ng/mL', value: 3.2, unit: 'ng/mL', referenceRange: '1.0-4.0', status: 'normal', notes: 'Good ovarian reserve' },
      { patientId: 1, cycleId: 1, testType: 'FSH', testDate: '2025-01-05', result: '7.1 mIU/mL', value: 7.1, unit: 'mIU/mL', referenceRange: '3.5-12.5', status: 'normal', notes: 'Within normal range' },
      { patientId: 2, cycleId: 2, testType: 'Estradiol', testDate: '2025-01-12', result: '245 pg/mL', value: 245, unit: 'pg/mL', referenceRange: '200-400', status: 'normal', notes: 'Peak stimulation level' },
      { patientId: 3, cycleId: 3, testType: 'Progesterone', testDate: '2025-02-05', result: '18.5 ng/mL', value: 18.5, unit: 'ng/mL', referenceRange: '10-25', status: 'normal', notes: 'Luteal phase support adequate' },
      { patientId: 4, cycleId: 4, testType: 'AMH', testDate: '2025-02-08', result: '1.2 ng/mL', value: 1.2, unit: 'ng/mL', referenceRange: '1.0-4.0', status: 'normal', notes: 'Borderline low reserve' },
      { patientId: 5, cycleId: 5, testType: 'LH', testDate: '2025-02-12', result: '15.3 mIU/mL', value: 15.3, unit: 'mIU/mL', referenceRange: '2-15', status: 'abnormal', notes: 'Elevated - consistent with PCOS' },
      { patientId: 6, cycleId: 6, testType: 'TSH', testDate: '2025-02-28', result: '2.8 mIU/L', value: 2.8, unit: 'mIU/L', referenceRange: '0.5-4.5', status: 'normal', notes: 'Thyroid function normal' },
      { patientId: 7, cycleId: 7, testType: 'Beta-hCG', testDate: '2025-03-20', result: '285 mIU/mL', value: 285, unit: 'mIU/mL', referenceRange: '>25', status: 'normal', notes: 'Positive pregnancy test!' },
      { patientId: 8, cycleId: 8, testType: 'Prolactin', testDate: '2025-03-08', result: '12.5 ng/mL', value: 12.5, unit: 'ng/mL', referenceRange: '4-23', status: 'normal', notes: 'Within range' },
      { patientId: 9, cycleId: 9, testType: 'Estradiol', testDate: '2025-03-12', result: '180 pg/mL', value: 180, unit: 'pg/mL', referenceRange: '200-400', status: 'abnormal', notes: 'Suboptimal response' },
      { patientId: 10, cycleId: 10, testType: 'AMH', testDate: '2025-03-18', result: '4.8 ng/mL', value: 4.8, unit: 'ng/mL', referenceRange: '1.0-4.0', status: 'normal', notes: 'Excellent ovarian reserve' },
      { patientId: 11, cycleId: 11, testType: 'Vitamin D', testDate: '2025-03-28', result: '22 ng/mL', value: 22, unit: 'ng/mL', referenceRange: '30-100', status: 'abnormal', notes: 'Deficient - supplement recommended' },
      { patientId: 12, cycleId: 12, testType: 'FSH', testDate: '2025-04-02', result: '13.5 mIU/mL', value: 13.5, unit: 'mIU/mL', referenceRange: '3.5-12.5', status: 'abnormal', notes: 'Elevated - diminished reserve' },
      { patientId: 13, cycleId: 13, testType: 'Antiphospholipid', testDate: '2025-04-08', result: 'Negative', value: 0, unit: 'titer', referenceRange: 'Negative', status: 'normal', notes: 'No antiphospholipid antibodies' },
      { patientId: 14, cycleId: 14, testType: 'Beta-hCG', testDate: '2025-04-28', result: '520 mIU/mL', value: 520, unit: 'mIU/mL', referenceRange: '>25', status: 'normal', notes: 'Strong positive - FET success' },
      { patientId: 15, cycleId: 15, testType: 'Estradiol', testDate: '2025-04-22', result: '310 pg/mL', value: 310, unit: 'pg/mL', referenceRange: '200-400', status: 'normal', notes: 'Good stimulation response' }
    ]);
    console.log('Lab Results seeded');

    // Genetic Screenings (15+)
    await GeneticScreening.bulkCreate([
      { embryoId: 1, patientId: 1, screeningType: 'PGT-A', testDate: '2025-01-20', result: 'euploid', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'none', sex: 'XX' }, labName: 'CooperGenomics', notes: 'Normal female euploid' },
      { embryoId: 2, patientId: 1, screeningType: 'PGT-A', testDate: '2025-01-20', result: 'euploid', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'none', sex: 'XY' }, labName: 'CooperGenomics', notes: 'Normal male euploid' },
      { embryoId: 3, patientId: 2, screeningType: 'PGT-A', testDate: '2025-01-25', result: 'euploid', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'none', sex: 'XX' }, labName: 'Natera', notes: 'Normal euploid' },
      { embryoId: 4, patientId: 3, screeningType: 'PGT-A', testDate: '2025-02-10', result: 'euploid', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'none', sex: 'XY' }, labName: 'Igenomix', notes: 'Excellent quality euploid' },
      { embryoId: 5, patientId: 3, screeningType: 'PGT-A', testDate: '2025-02-10', result: 'pending', chromosomeDetails: {}, labName: 'Igenomix', notes: 'Results pending' },
      { embryoId: 6, patientId: 4, screeningType: 'PGT-A', testDate: '2025-02-18', result: 'aneuploid', chromosomeDetails: { totalChromosomes: 45, abnormalities: 'Monosomy 16', sex: 'XY' }, labName: 'CooperGenomics', notes: 'Aneuploid - not suitable for transfer' },
      { embryoId: 7, patientId: 5, screeningType: 'PGT-A', testDate: '2025-02-22', result: 'euploid', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'none', sex: 'XX' }, labName: 'Natera', notes: 'Normal euploid - transferred' },
      { embryoId: 8, patientId: 5, screeningType: 'PGT-A', testDate: '2025-02-22', result: 'euploid', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'none', sex: 'XY' }, labName: 'Natera', notes: 'Normal euploid - frozen' },
      { embryoId: 9, patientId: 7, screeningType: 'PGT-A', testDate: '2025-03-12', result: 'euploid', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'none', sex: 'XX' }, labName: 'Igenomix', notes: 'Excellent - hatching blast euploid' },
      { embryoId: 10, patientId: 7, screeningType: 'PGT-A', testDate: '2025-03-12', result: 'euploid', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'none', sex: 'XY' }, labName: 'Igenomix', notes: 'Normal male euploid' },
      { embryoId: 11, patientId: 10, screeningType: 'PGT-A', testDate: '2025-03-28', result: 'euploid', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'none', sex: 'XX' }, labName: 'CooperGenomics', notes: 'Normal euploid' },
      { embryoId: 12, patientId: 10, screeningType: 'PGT-A', testDate: '2025-03-28', result: 'mosaic', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'Low-level mosaic trisomy 2', mosaicismLevel: '25%' }, labName: 'CooperGenomics', notes: 'Low-level mosaic - counseling needed' },
      { embryoId: 13, patientId: 13, screeningType: 'PGT-A', testDate: '2025-04-15', result: 'pending', chromosomeDetails: {}, labName: 'Natera', notes: 'Awaiting results' },
      { embryoId: 14, patientId: 13, screeningType: 'PGT-A', testDate: '2025-04-15', result: 'pending', chromosomeDetails: {}, labName: 'Natera', notes: 'Awaiting results' },
      { embryoId: 16, patientId: 16, screeningType: 'PGT-A', testDate: '2025-05-02', result: 'euploid', chromosomeDetails: { totalChromosomes: 46, abnormalities: 'none', sex: 'XX' }, labName: 'Igenomix', notes: 'Excellent - top quality euploid' },
      { embryoId: 13, patientId: 13, screeningType: 'PGT-M', testDate: '2025-04-18', result: 'pending', chromosomeDetails: { condition: 'Cystic Fibrosis carrier screening' }, labName: 'GeneDx', notes: 'CF carrier screening in progress' }
    ]);
    console.log('Genetic Screenings seeded');

    // Transfer Plans (15+)
    await TransferPlan.bulkCreate([
      { patientId: 1, cycleId: 1, embryoId: 1, doctorId: 1, transferDate: '2025-01-25', transferType: 'fresh', endometrialThickness: 10.5, progesteroneLevel: 15.2, estrogenLevel: 280, status: 'planned', notes: 'Day 5 fresh transfer planned' },
      { patientId: 2, cycleId: 2, embryoId: 3, doctorId: 1, transferDate: '2025-01-28', transferType: 'fresh', endometrialThickness: 9.8, progesteroneLevel: 14.8, estrogenLevel: 265, status: 'completed', outcome: 'Positive beta-hCG', notes: 'Successful transfer' },
      { patientId: 3, cycleId: 3, embryoId: 4, doctorId: 3, transferDate: '2025-02-12', transferType: 'fresh', endometrialThickness: 11.2, progesteroneLevel: 16.5, estrogenLevel: 310, status: 'planned', notes: 'Exceptional embryo for transfer' },
      { patientId: 4, cycleId: 4, embryoId: 6, doctorId: 1, transferDate: '2025-02-15', transferType: 'fresh', endometrialThickness: 7.5, progesteroneLevel: 11.0, estrogenLevel: 180, status: 'completed', outcome: 'Negative', notes: 'Thin endometrium concern' },
      { patientId: 5, cycleId: 5, embryoId: 7, doctorId: 6, transferDate: '2025-02-25', transferType: 'fresh', endometrialThickness: 10.8, progesteroneLevel: 15.8, estrogenLevel: 295, status: 'completed', outcome: 'Positive beta-hCG', notes: 'PCOS patient - successful' },
      { patientId: 6, cycleId: 6, doctorId: 1, transferDate: '2025-03-10', transferType: 'fresh', endometrialThickness: 9.2, progesteroneLevel: 13.5, estrogenLevel: 240, status: 'planned', notes: 'Awaiting embryo selection' },
      { patientId: 7, cycleId: 7, embryoId: 9, doctorId: 3, transferDate: '2025-03-18', transferType: 'fresh', endometrialThickness: 11.5, progesteroneLevel: 17.2, estrogenLevel: 320, status: 'completed', outcome: 'Positive beta-hCG', notes: 'Excellent conditions' },
      { patientId: 8, cycleId: 8, doctorId: 8, transferDate: '2025-03-22', transferType: 'fresh', endometrialThickness: 9.5, progesteroneLevel: 14.0, estrogenLevel: 255, status: 'planned', notes: 'Scheduling in progress' },
      { patientId: 9, cycleId: 9, doctorId: 1, transferDate: '2025-03-25', transferType: 'fresh', endometrialThickness: 8.8, progesteroneLevel: 12.5, estrogenLevel: 220, status: 'completed', outcome: 'Chemical pregnancy', notes: 'Brief implantation detected' },
      { patientId: 10, cycleId: 10, embryoId: 11, doctorId: 6, transferDate: '2025-04-02', transferType: 'fresh', endometrialThickness: 10.2, progesteroneLevel: 15.0, estrogenLevel: 275, status: 'planned', notes: 'Donor sperm cycle transfer' },
      { patientId: 11, cycleId: 11, doctorId: 8, transferDate: '2025-04-08', transferType: 'fresh', endometrialThickness: 9.9, progesteroneLevel: 14.5, estrogenLevel: 260, status: 'planned', notes: 'First transfer attempt' },
      { patientId: 12, cycleId: 12, doctorId: 1, transferDate: '2025-04-12', transferType: 'natural', endometrialThickness: 8.0, progesteroneLevel: 11.8, estrogenLevel: 195, status: 'completed', outcome: 'Negative', notes: 'Natural cycle mini IVF' },
      { patientId: 14, cycleId: 14, doctorId: 3, transferDate: '2025-04-22', transferType: 'frozen', endometrialThickness: 10.0, progesteroneLevel: 15.5, estrogenLevel: 285, status: 'completed', outcome: 'Positive beta-hCG', notes: 'FET success' },
      { patientId: 15, cycleId: 15, embryoId: 15, doctorId: 6, transferDate: '2025-04-28', transferType: 'fresh', endometrialThickness: 10.3, progesteroneLevel: 14.8, estrogenLevel: 270, status: 'planned', notes: 'Post IUI failure - IVF transfer' },
      { patientId: 16, cycleId: 16, doctorId: 1, transferDate: '2025-05-15', transferType: 'frozen', endometrialThickness: 0, progesteroneLevel: 0, estrogenLevel: 0, status: 'planned', notes: 'FET planned after freeze-all' },
      { patientId: 1, cycleId: 1, embryoId: 2, doctorId: 1, transferDate: '2025-06-01', transferType: 'frozen', endometrialThickness: 0, progesteroneLevel: 0, estrogenLevel: 0, status: 'planned', notes: 'Backup FET if fresh fails' }
    ]);
    console.log('Transfer Plans seeded');

    // Quality Control (15+)
    await QualityControl.bulkCreate([
      { category: 'Lab Environment', metric: 'Incubator Temperature', value: 37.0, target: 37.0, unit: '°C', checkDate: '2025-04-01', performedBy: 'Dr. Wilson', status: 'pass', notes: 'Within tolerance ±0.1°C' },
      { category: 'Lab Environment', metric: 'Incubator CO2 Level', value: 6.0, target: 6.0, unit: '%', checkDate: '2025-04-01', performedBy: 'Dr. Wilson', status: 'pass', notes: 'Optimal CO2 concentration' },
      { category: 'Lab Environment', metric: 'Incubator Humidity', value: 95, target: 95, unit: '%', checkDate: '2025-04-01', performedBy: 'Dr. Wilson', status: 'pass', notes: 'Humidity within range' },
      { category: 'Lab Environment', metric: 'Air Quality VOC', value: 0.02, target: 0.05, unit: 'ppm', checkDate: '2025-04-01', performedBy: 'Dr. Nguyen', status: 'pass', notes: 'Well below threshold' },
      { category: 'Media Quality', metric: 'Culture Media pH', value: 7.35, target: 7.35, unit: 'pH', checkDate: '2025-04-02', performedBy: 'Dr. Petrov', status: 'pass', notes: 'pH within acceptable range' },
      { category: 'Media Quality', metric: 'Media Osmolality', value: 275, target: 275, unit: 'mOsm/kg', checkDate: '2025-04-02', performedBy: 'Dr. Petrov', status: 'pass', notes: 'Osmolality stable' },
      { category: 'Equipment', metric: 'Microscope Calibration', value: 100, target: 100, unit: '%', checkDate: '2025-04-03', performedBy: 'Dr. Wilson', status: 'pass', notes: 'All microscopes calibrated' },
      { category: 'Equipment', metric: 'Laminar Flow Hood', value: 0.45, target: 0.45, unit: 'm/s', checkDate: '2025-04-03', performedBy: 'Dr. Nguyen', status: 'pass', notes: 'Airflow within spec' },
      { category: 'Performance', metric: 'Fertilization Rate', value: 78.5, target: 75.0, unit: '%', checkDate: '2025-04-05', performedBy: 'Dr. Chen', status: 'pass', notes: 'Above target' },
      { category: 'Performance', metric: 'Blastocyst Rate', value: 52.3, target: 50.0, unit: '%', checkDate: '2025-04-05', performedBy: 'Dr. Chen', status: 'pass', notes: 'Meeting expectations' },
      { category: 'Performance', metric: 'Clinical Pregnancy Rate', value: 48.2, target: 50.0, unit: '%', checkDate: '2025-04-05', performedBy: 'Dr. Chen', status: 'warning', notes: 'Slightly below target - monitoring' },
      { category: 'Performance', metric: 'Implantation Rate', value: 38.5, target: 40.0, unit: '%', checkDate: '2025-04-05', performedBy: 'Dr. Chen', status: 'warning', notes: 'Below target - review protocols' },
      { category: 'Safety', metric: 'Cryotank Nitrogen Level', value: 85, target: 80, unit: '%', checkDate: '2025-04-06', performedBy: 'Lab Tech', status: 'pass', notes: 'Above minimum threshold' },
      { category: 'Safety', metric: 'Witness System Check', value: 100, target: 100, unit: '%', checkDate: '2025-04-06', performedBy: 'Dr. Nguyen', status: 'pass', notes: 'All electronic witnessing operational' },
      { category: 'Safety', metric: 'Emergency Power Test', value: 100, target: 100, unit: '%', checkDate: '2025-04-07', performedBy: 'Facilities', status: 'pass', notes: 'Generator switchover 8 seconds' },
      { category: 'Equipment', metric: 'Laser System Calibration', value: 98, target: 95, unit: '%', checkDate: '2025-04-07', performedBy: 'Dr. Wilson', status: 'pass', notes: 'Biopsy laser performing well' }
    ]);
    console.log('Quality Control seeded');

    // AI Reports (15+)
    await AIReport.bulkCreate([
      { patientId: 1, reportType: 'cycle-summary', title: 'IVF Cycle Summary - Emma Thompson', content: 'Comprehensive cycle 1 summary with excellent response to stimulation. 12 oocytes retrieved, 6 high-quality embryos created.', aiAnalysis: { successIndicators: ['good response', 'high quality embryos'], riskFactors: ['first cycle'] }, generatedBy: 'AI', status: 'final' },
      { patientId: 2, reportType: 'patient-prognosis', title: 'Patient Prognosis - Sarah Martinez', content: 'Moderate prognosis with endometriosis consideration. Previous positive outcome in cycle 2 is encouraging.', aiAnalysis: { successProbability: 55, keyFactors: ['endometriosis', 'age'] }, generatedBy: 'AI', status: 'final' },
      { patientId: 3, reportType: 'embryo-ranking', title: 'Embryo Ranking Report - Jessica Chen', content: 'Top embryo EMB-003-A ranked #1 with 5AA grade. Exceptional hatching blastocyst with perfect morphology.', aiAnalysis: { topEmbryo: 'EMB-003-A', ranking: ['EMB-003-A', 'EMB-003-B'] }, generatedBy: 'AI', status: 'final' },
      { reportType: 'clinic-performance', title: 'Q1 2025 Clinic Performance Report', content: 'Overall clinic performance meets national benchmarks. Fertilization rate at 78.5% exceeds target.', aiAnalysis: { quarter: 'Q1 2025', overallRating: 'good' }, generatedBy: 'AI', status: 'reviewed' },
      { patientId: 5, reportType: 'cycle-summary', title: 'IVF Cycle Summary - Rachel Brown', content: 'PCOS patient with excellent response. Careful OHSS monitoring resulted in successful outcome.', aiAnalysis: { ohssRisk: 'managed', outcome: 'positive' }, generatedBy: 'AI', status: 'final' },
      { reportType: 'lab-quality', title: 'Lab Quality Assurance Report - April 2025', content: 'All critical QC parameters within acceptable ranges. Two warning metrics for implantation and pregnancy rates.', aiAnalysis: { passRate: '87.5%', warnings: 2 }, generatedBy: 'AI', status: 'reviewed' },
      { patientId: 7, reportType: 'patient-prognosis', title: 'Patient Prognosis - Michelle Davis', content: 'Excellent prognosis with young age, high AMH, and exceptional embryo quality. 78% predicted success.', aiAnalysis: { successProbability: 78, confidence: 'high' }, generatedBy: 'AI', status: 'final' },
      { patientId: 4, reportType: 'cycle-summary', title: 'IVF Cycle Summary - Amanda Williams', content: 'Poor response cycle with only 4 oocytes retrieved. DOR confirmed. Recommend donor egg consultation.', aiAnalysis: { response: 'poor', recommendation: 'donor eggs' }, generatedBy: 'AI', status: 'final' },
      { reportType: 'clinic-performance', title: 'Annual Success Rate Analysis 2024', content: 'Comprehensive analysis of clinic success rates by age group, protocol type, and embryo characteristics.', aiAnalysis: { year: 2024, overallSuccessRate: '52.3%' }, generatedBy: 'AI', status: 'reviewed' },
      { patientId: 10, reportType: 'embryo-ranking', title: 'Embryo Ranking - Nicole Moore', content: 'EMB-010-A ranked #1 (euploid, 4AA). EMB-010-B has mosaic result requiring genetic counseling.', aiAnalysis: { topEmbryo: 'EMB-010-A', mosaicConcern: 'EMB-010-B' }, generatedBy: 'AI', status: 'final' },
      { patientId: 12, reportType: 'patient-prognosis', title: 'Prognosis - Lauren White (AMA)', content: 'Advanced maternal age with diminished reserve. Fourth cycle with minimal response. Donor egg strongly recommended.', aiAnalysis: { successProbability: 12, recommendation: 'donor_eggs' }, generatedBy: 'AI', status: 'final' },
      { patientId: 13, reportType: 'cycle-summary', title: 'IVF Cycle Summary - Megan Harris (RPL)', content: 'Freeze-all cycle for PGT-A. 7 embryos created, 2 biopsied. RPL protocol adjustments recommended.', aiAnalysis: { pgtPending: true, embryosBiopsied: 2 }, generatedBy: 'AI', status: 'draft' },
      { reportType: 'clinic-performance', title: 'Monthly Dashboard - March 2025', content: 'March metrics: 8 cycles started, 6 retrievals, 4 transfers, 2 positive outcomes. Cumulative pregnancy rate 50%.', aiAnalysis: { month: 'March 2025', cyclesStarted: 8, positiveOutcomes: 2 }, generatedBy: 'AI', status: 'final' },
      { patientId: 16, reportType: 'patient-prognosis', title: 'Prognosis - Danielle Robinson (PCOS)', content: 'Excellent prognosis despite PCOS. Young age with exceptional embryo quality. OHSS risk well managed.', aiAnalysis: { successProbability: 74, ohssRisk: 'high_managed' }, generatedBy: 'AI', status: 'final' },
      { reportType: 'lab-quality', title: 'Equipment Maintenance Schedule Q2 2025', content: 'Scheduled maintenance for all incubators, microscopes, and cryostorage systems. Emergency protocols reviewed.', aiAnalysis: { equipmentCount: 24, nextMaintenance: '2025-06-01' }, generatedBy: 'AI', status: 'draft' },
      { patientId: 9, reportType: 'cycle-summary', title: 'IVF Cycle Summary - Stephanie Taylor', content: 'Third cycle resulted in chemical pregnancy. Consider ERA testing and immune panel before next cycle.', aiAnalysis: { outcome: 'chemical', recommendation: 'ERA_testing' }, generatedBy: 'AI', status: 'final' }
    ]);
    console.log('AI Reports seeded');

    // Appointments (15+)
    await Appointment.bulkCreate([
      { patientId: 1, doctorId: 1, appointmentDate: '2025-05-01T09:00:00', duration: 30, type: 'Follow-up Consultation', status: 'scheduled', notes: 'Review cycle results and next steps' },
      { patientId: 2, doctorId: 1, appointmentDate: '2025-05-01T10:00:00', duration: 45, type: 'Pregnancy Scan', status: 'scheduled', notes: 'First ultrasound 6 weeks' },
      { patientId: 3, doctorId: 3, appointmentDate: '2025-05-02T09:00:00', duration: 30, type: 'Transfer Preparation', status: 'scheduled', notes: 'Pre-transfer assessment' },
      { patientId: 4, doctorId: 1, appointmentDate: '2025-05-02T11:00:00', duration: 60, type: 'Consultation', status: 'scheduled', notes: 'Discuss donor egg options' },
      { patientId: 5, doctorId: 6, appointmentDate: '2025-05-03T09:00:00', duration: 30, type: 'Pregnancy Scan', status: 'scheduled', notes: '8 week ultrasound' },
      { patientId: 6, doctorId: 1, appointmentDate: '2025-05-03T10:30:00', duration: 30, type: 'Monitoring', status: 'scheduled', notes: 'Follicular monitoring day 8' },
      { patientId: 7, doctorId: 3, appointmentDate: '2025-05-04T09:00:00', duration: 30, type: 'Pregnancy Scan', status: 'scheduled', notes: '10 week NT scan' },
      { patientId: 8, doctorId: 8, appointmentDate: '2025-05-04T10:00:00', duration: 45, type: 'Transfer Day', status: 'scheduled', notes: 'Embryo transfer procedure' },
      { patientId: 9, doctorId: 1, appointmentDate: '2025-05-05T09:00:00', duration: 60, type: 'Consultation', status: 'scheduled', notes: 'Review failed cycle - plan next steps' },
      { patientId: 10, doctorId: 6, appointmentDate: '2025-05-05T11:00:00', duration: 30, type: 'Transfer Preparation', status: 'scheduled', notes: 'Pre-transfer scan and bloodwork' },
      { patientId: 11, doctorId: 8, appointmentDate: '2025-05-06T09:00:00', duration: 30, type: 'Monitoring', status: 'scheduled', notes: 'Stimulation monitoring' },
      { patientId: 12, doctorId: 1, appointmentDate: '2025-05-06T10:30:00', duration: 60, type: 'Consultation', status: 'scheduled', notes: 'End of treatment counseling' },
      { patientId: 13, doctorId: 5, appointmentDate: '2025-05-07T09:00:00', duration: 45, type: 'Genetic Counseling', status: 'scheduled', notes: 'PGT-A results review' },
      { patientId: 14, doctorId: 3, appointmentDate: '2025-05-07T10:30:00', duration: 30, type: 'Pregnancy Scan', status: 'scheduled', notes: 'Viability scan post FET' },
      { patientId: 15, doctorId: 6, appointmentDate: '2025-05-08T09:00:00', duration: 30, type: 'Transfer Day', status: 'scheduled', notes: 'Fresh embryo transfer' },
      { patientId: 16, doctorId: 1, appointmentDate: '2025-05-08T10:30:00', duration: 45, type: 'FET Planning', status: 'scheduled', notes: 'Plan frozen embryo transfer cycle' }
    ]);
    console.log('Appointments seeded');

    // Billing (15+)
    await Billing.bulkCreate([
      { patientId: 1, cycleId: 1, description: 'IVF Cycle Package - Standard', amount: 12000, tax: 0, total: 12000, paymentMethod: 'Insurance + Self-Pay', status: 'paid', dueDate: '2025-01-10', paidDate: '2025-01-10', invoiceNumber: 'INV-2025-001', notes: 'Insurance covered 60%' },
      { patientId: 2, cycleId: 2, description: 'ICSI Cycle Package', amount: 14500, tax: 0, total: 14500, paymentMethod: 'Credit Card', status: 'paid', dueDate: '2025-01-15', paidDate: '2025-01-15', invoiceNumber: 'INV-2025-002', notes: 'Full self-pay' },
      { patientId: 3, cycleId: 3, description: 'ICSI Cycle with PGT-A', amount: 18000, tax: 0, total: 18000, paymentMethod: 'Payment Plan', status: 'partial', dueDate: '2025-02-01', invoiceNumber: 'INV-2025-003', notes: '3-month payment plan' },
      { patientId: 4, cycleId: 4, description: 'IVF Cycle - DOR Protocol', amount: 15000, tax: 0, total: 15000, paymentMethod: 'Insurance', status: 'paid', dueDate: '2025-02-10', paidDate: '2025-02-12', invoiceNumber: 'INV-2025-004', notes: 'Fully insured' },
      { patientId: 5, cycleId: 5, description: 'IVF Cycle Package - PCOS', amount: 13500, tax: 0, total: 13500, paymentMethod: 'Credit Card', status: 'paid', dueDate: '2025-02-15', paidDate: '2025-02-15', invoiceNumber: 'INV-2025-005', notes: 'Includes OHSS monitoring' },
      { patientId: 6, cycleId: 6, description: 'IVF Standard Cycle', amount: 12000, tax: 0, total: 12000, paymentMethod: 'Insurance + Self-Pay', status: 'pending', dueDate: '2025-03-15', invoiceNumber: 'INV-2025-006', notes: 'Awaiting insurance approval' },
      { patientId: 7, cycleId: 7, description: 'IVF Cycle with Medications', amount: 16000, tax: 0, total: 16000, paymentMethod: 'Self-Pay', status: 'paid', dueDate: '2025-03-05', paidDate: '2025-03-05', invoiceNumber: 'INV-2025-007', notes: 'Includes all medications' },
      { patientId: 8, cycleId: 8, description: 'ICSI Optimization Package', amount: 14000, tax: 0, total: 14000, paymentMethod: 'Payment Plan', status: 'partial', dueDate: '2025-03-10', invoiceNumber: 'INV-2025-008', notes: '6-month payment plan' },
      { patientId: 9, cycleId: 9, description: 'IVF Cycle - Third Attempt', amount: 10000, tax: 0, total: 10000, paymentMethod: 'Multi-Cycle Discount', status: 'paid', dueDate: '2025-03-15', paidDate: '2025-03-15', invoiceNumber: 'INV-2025-009', notes: '25% loyalty discount applied' },
      { patientId: 10, cycleId: 10, description: 'ICSI with Donor Sperm', amount: 16500, tax: 0, total: 16500, paymentMethod: 'Credit Card', status: 'paid', dueDate: '2025-03-20', paidDate: '2025-03-20', invoiceNumber: 'INV-2025-010', notes: 'Includes donor sperm procurement' },
      { patientId: 11, cycleId: 11, description: 'First IVF Cycle Package', amount: 12500, tax: 0, total: 12500, paymentMethod: 'Insurance', status: 'pending', dueDate: '2025-04-15', invoiceNumber: 'INV-2025-011', notes: 'Insurance pre-auth in process' },
      { patientId: 12, cycleId: 12, description: 'Mini IVF Natural Cycle', amount: 5500, tax: 0, total: 5500, paymentMethod: 'Self-Pay', status: 'paid', dueDate: '2025-04-05', paidDate: '2025-04-05', invoiceNumber: 'INV-2025-012', notes: 'Reduced cost natural cycle' },
      { patientId: 13, cycleId: 13, description: 'IVF with PGT-A Freeze All', amount: 19000, tax: 0, total: 19000, paymentMethod: 'Payment Plan', status: 'partial', dueDate: '2025-04-10', invoiceNumber: 'INV-2025-013', notes: 'Includes PGT-A for all embryos' },
      { patientId: 14, cycleId: 14, description: 'Frozen Embryo Transfer', amount: 4500, tax: 0, total: 4500, paymentMethod: 'Insurance', status: 'paid', dueDate: '2025-04-15', paidDate: '2025-04-16', invoiceNumber: 'INV-2025-014', notes: 'FET only - embryos from previous cycle' },
      { patientId: 15, cycleId: 15, description: 'IVF Conversion from IUI', amount: 11000, tax: 0, total: 11000, paymentMethod: 'Self-Pay', status: 'pending', dueDate: '2025-04-30', invoiceNumber: 'INV-2025-015', notes: 'Converted from failed IUI program' },
      { patientId: 16, cycleId: 16, description: 'IVF PCOS Freeze All Package', amount: 17500, tax: 0, total: 17500, paymentMethod: 'Credit Card', status: 'paid', dueDate: '2025-04-25', paidDate: '2025-04-25', invoiceNumber: 'INV-2025-016', notes: 'Freeze all due to OHSS risk' }
    ]);
    console.log('Billing seeded');

    console.log('\\nAll seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
if (process.env.ALLOW_DEMO_SEED !== 'true') { console.error('Demo clinical seed refused; set ALLOW_DEMO_SEED=true explicitly. Never use demo records clinically.'); process.exit(64); }
