namespace MedPra.Api.DTOs;

public record StartCaseRequest(string Specialty);
public record ChatRequest(Guid SessionId, string Message);
public record ChatMessage(string Role, string Content); // "student" | "patient"
public record RequestTestsRequest(Guid SessionId, List<string> Tests);
public record SubmitDiagnosisRequest(
    Guid SessionId,
    string Diagnosis,
    string Treatment,
    List<string> DifferentialDiagnoses,
    int? TimeTakenSeconds
);

public record PatientVitals(
    int HeartRate, int SystolicBP, int DiastolicBP,
    double Temperature, int RespiratoryRate, int OxygenSaturation
);

public record PatientData(
    string Name, int Age, string Gender,
    string ChiefComplaint,
    string PresentIllness,
    List<string> PastMedicalHistory,
    List<string> Medications,
    List<string> Surgeries,
    List<string> Allergies,
    string FamilyHistory,
    string SocialHistory,
    PatientVitals Vitals,
    string PhysicalExam,
    string ImagingFindings,
    string CorrectDiagnosis,
    string DifficultyLevel
);

public record TestResult(string TestName, string Result, string Unit, string ReferenceRange, bool IsAbnormal);

public class DiagnosisEvaluation
{
    public bool IsCorrect { get; set; }
    public int Score { get; set; }
    public int TestEfficiencyScore { get; set; }
    public int DifferentialScore { get; set; }
    public string Feedback { get; set; } = string.Empty;
    public string CorrectDiagnosis { get; set; } = string.Empty;
    public string CorrectTreatment { get; set; } = string.Empty;
    public string DifferentialAnalysis { get; set; } = string.Empty;
    public List<string> CorrectDifferentials { get; set; } = [];
    public List<string> MissedAnamnesis { get; set; } = [];
    public string TestAnalysis { get; set; } = string.Empty;
    public List<string> UnnecessaryTests { get; set; } = [];
    public List<string> MissingCriticalTests { get; set; } = [];
}

public class DiseaseSummary
{
    public string DiseaseName { get; set; } = string.Empty;
    public string ClassicPresentation { get; set; } = string.Empty;
    public List<string> PathognomonicFindings { get; set; } = [];
    public List<string> KeyTests { get; set; } = [];
    public string FirstLineTreatment { get; set; } = string.Empty;
    public List<string> TusHighlights { get; set; } = [];
    public List<string> IdealAnamnesisQuestions { get; set; } = [];
    public List<string> KeyExamFindings { get; set; } = [];
    public string TestingStrategy { get; set; } = string.Empty;
}

public record PhysicalExamRequest(Guid SessionId, string ExamType);
public record PhysicalExamResult(string ExamType, string Finding);

public record LeaderboardEntry(
    string FullName, int TotalCases, int CorrectCases,
    double SuccessRate, int TotalScore
);
