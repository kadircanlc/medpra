namespace MedPra.Api.Models;

public class CaseSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Specialty { get; set; } = string.Empty;
    public int? SelectedDiseaseId { get; set; }
    public string PatientDataJson { get; set; } = string.Empty;
    public string ChatHistoryJson { get; set; } = "[]";
    public string TestResultsJson { get; set; } = "[]";
    public string RequestedTestsJson { get; set; } = "[]";
    public string? StudentDiagnosis { get; set; }
    public string? StudentTreatment { get; set; }
    public string CorrectDiagnosis { get; set; } = string.Empty;
    public bool? IsCorrect { get; set; }
    public int? DiagnosisScore { get; set; }
    public string? AiFeedback { get; set; }
    public string Status { get; set; } = "active";
    public string? StudentDifferentials { get; set; }
    public int? TimeTakenSeconds { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}
