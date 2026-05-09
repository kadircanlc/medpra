export interface Vitals {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

export interface Patient {
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  difficultyLevel: string;
  vitals: Vitals;
}

export interface ChatMsg {
  role: "student" | "patient";
  content: string;
}

export interface TestResult {
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface ExamResult {
  examType: string;
  finding: string;
}

export interface Evaluation {
  isCorrect: boolean;
  score: number;
  testEfficiencyScore: number;
  differentialScore: number;
  feedback: string;
  correctDiagnosis: string;
  correctTreatment: string;
  differentialAnalysis: string;
  correctDifferentials: string[];
  missedAnamnesis: string[];
  testAnalysis: string;
  unnecessaryTests: string[];
  missingCriticalTests: string[];
}

export interface DiseaseSummary {
  diseaseName: string;
  classicPresentation: string;
  pathognomonicFindings: string[];
  keyTests: string[];
  firstLineTreatment: string;
  tusHighlights: string[];
  idealAnamnesisQuestions: string[];
  keyExamFindings: string[];
  testingStrategy: string;
}
