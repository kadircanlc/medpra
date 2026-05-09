using MedPra.Api.DTOs;

namespace MedPra.Api.Services.Interfaces;

public interface IEvaluationService
{
    Task<DiagnosisEvaluation> EvaluateDiagnosisAsync(
        string patientJson, string chatSummary,
        string studentDiagnosis, string studentTreatment,
        string correctDiagnosis, List<string> requestedTests,
        List<string> studentDifferentials);

    Task<DiseaseSummary> GenerateDiseaseSummaryAsync(string diseaseName, string specialty);
}
