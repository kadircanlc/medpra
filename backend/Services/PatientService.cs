using System.Text.Json;
using Anthropic.SDK;
using Anthropic.SDK.Constants;
using Anthropic.SDK.Messaging;
using Microsoft.EntityFrameworkCore;
using MedPra.Api.Data;
using MedPra.Api.DTOs;
using MedPra.Api.Prompts;
using MedPra.Api.Services.Helpers;
using MedPra.Api.Services.Interfaces;

namespace MedPra.Api.Services;

public class PatientService(AnthropicClient client, AppDbContext db) : IPatientService
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task<(PatientData Patient, int? DiseaseId)> GeneratePatientAsync(string specialty, Guid userId)
    {
        var allDiseases = await db.Diseases
            .Where(d => d.Specialty == specialty && d.IsActive)
            .ToListAsync();

        var usedIds = await db.CaseSessions
            .Where(s => s.UserId == userId && s.Specialty == specialty && s.SelectedDiseaseId != null)
            .Select(s => s.SelectedDiseaseId!.Value)
            .ToListAsync();
        var usedSet = usedIds.ToHashSet();

        var available = allDiseases.Where(d => !usedSet.Contains(d.Id)).ToList();

        // Hepsi görüldüyse sıfırla
        if (available.Count == 0)
            available = allDiseases;

        var selected = available.Count > 0 ? available[Random.Shared.Next(available.Count)] : null;
        var diseaseName = selected?.Name ?? string.Empty;

        var diseaseInstruction = string.IsNullOrEmpty(diseaseName)
            ? $"'{specialty}' branşından TUS müfredatına uygun bir hastalık seç."
            : $"Hastalık: '{diseaseName}'";
        var correctDiagnosisHint = string.IsNullOrEmpty(diseaseName) ? specialty + " hastalığı" : diseaseName;

        var prompt = PatientPrompts.GeneratePatient(diseaseInstruction, correctDiagnosisHint);

        var response = await client.Messages.GetClaudeMessageAsync(new MessageParameters
        {
            Model = AnthropicModels.Claude46Sonnet,
            MaxTokens = 3000,
            Messages = [new Message(RoleType.User, prompt)]
        });

        var json = ClaudeHelpers.ExtractObject(response.Message.ToString());
        var patient = JsonSerializer.Deserialize<PatientData>(json, JsonOpts)
               ?? throw new Exception("Hasta verisi oluşturulamadı.");

        return (patient, selected?.Id);
    }

    public async Task<string> RespondAsPatientAsync(string patientJson, List<ChatMessage> history, string studentMessage)
    {
        var patient = JsonSerializer.Deserialize<PatientData>(patientJson, JsonOpts)!;
        var systemPrompt = PatientPrompts.RespondAsPatientSystem(patient);

        var messages = history
            .Select(m => new Message(m.Role == "student" ? RoleType.User : RoleType.Assistant, m.Content))
            .ToList();
        messages.Add(new Message(RoleType.User, studentMessage));

        var response = await client.Messages.GetClaudeMessageAsync(new MessageParameters
        {
            Model = AnthropicModels.Claude46Sonnet,
            MaxTokens = 400,
            System = [new SystemMessage(systemPrompt)],
            Messages = messages
        });

        return response.Message.ToString().Trim();
    }

    public async Task<List<TestResult>> GenerateTestResultsAsync(
        string patientJson, List<string> requestedTests, List<TestResult> existingResults)
    {
        var existingNames = existingResults.Select(r => r.TestName).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var newTests = requestedTests.Where(t => !existingNames.Contains(t)).ToList();
        if (!newTests.Any()) return [];

        var prompt = PatientPrompts.GenerateTestResults(
            ClaudeHelpers.SummarizePatient(patientJson),
            string.Join(", ", newTests));

        var response = await client.Messages.GetClaudeMessageAsync(new MessageParameters
        {
            Model = AnthropicModels.Claude46Sonnet,
            MaxTokens = 8000,
            Messages = [new Message(RoleType.User, prompt)]
        });

        var text = response.Message.ToString();
        var json = ClaudeHelpers.ExtractArray(text);
        try
        {
            return JsonSerializer.Deserialize<List<TestResult>>(json, JsonOpts) ?? [];
        }
        catch
        {
            var objJson = ClaudeHelpers.ExtractObject(text);
            using var doc = JsonDocument.Parse(objJson);
            foreach (var prop in doc.RootElement.EnumerateObject())
            {
                if (prop.Value.ValueKind == JsonValueKind.Array)
                    return JsonSerializer.Deserialize<List<TestResult>>(prop.Value.GetRawText(), JsonOpts) ?? [];
            }
            return [];
        }
    }

    public async Task<string> GetPhysicalExamFindingAsync(string patientJson, string examType)
    {
        var patient = JsonSerializer.Deserialize<PatientData>(patientJson, JsonOpts)!;
        var prompt = PatientPrompts.GetPhysicalExam(patient, examType);

        var response = await client.Messages.GetClaudeMessageAsync(new MessageParameters
        {
            Model = AnthropicModels.Claude46Sonnet,
            MaxTokens = 300,
            Messages = [new Message(RoleType.User, prompt)]
        });

        return response.Message.ToString().Trim();
    }
}
