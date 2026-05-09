using MedPra.Api.DTOs;

namespace MedPra.Api.Services.Interfaces;

public interface IPatientService
{
    Task<(PatientData Patient, int? DiseaseId)> GeneratePatientAsync(string specialty, Guid userId);
    Task<string> RespondAsPatientAsync(string patientJson, List<ChatMessage> history, string studentMessage);
    Task<List<TestResult>> GenerateTestResultsAsync(string patientJson, List<string> requestedTests, List<TestResult> existingResults);
    Task<string> GetPhysicalExamFindingAsync(string patientJson, string examType);
}
