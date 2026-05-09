using System.Text.Json;
using Anthropic.SDK;
using Anthropic.SDK.Constants;
using Anthropic.SDK.Messaging;
using MedPra.Api.DTOs;
using MedPra.Api.Prompts;
using MedPra.Api.Services.Helpers;
using MedPra.Api.Services.Interfaces;

namespace MedPra.Api.Services;

public class EvaluationService(AnthropicClient client) : IEvaluationService
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task<DiagnosisEvaluation> EvaluateDiagnosisAsync(
        string patientJson, string chatSummary,
        string studentDiagnosis, string studentTreatment,
        string correctDiagnosis, List<string> requestedTests,
        List<string> studentDifferentials)
    {
        var differentialsText = studentDifferentials.Count > 0
            ? string.Join(", ", studentDifferentials)
            : "Öğrenci ayırıcı tanı girmedi";

        var prompt = EvaluationPrompts.EvaluateDiagnosis(
            ClaudeHelpers.SummarizePatient(patientJson),
            chatSummary,
            correctDiagnosis,
            studentDiagnosis,
            studentTreatment,
            string.Join(", ", requestedTests),
            differentialsText);

        var response = await client.Messages.GetClaudeMessageAsync(new MessageParameters
        {
            Model = AnthropicModels.Claude46Sonnet,
            MaxTokens = 2500,
            Messages = [new Message(RoleType.User, prompt)]
        });

        var json = ClaudeHelpers.ExtractObject(response.Message.ToString());
        return JsonSerializer.Deserialize<DiagnosisEvaluation>(json, JsonOpts)
               ?? throw new Exception("Değerlendirme yapılamadı.");
    }

    public async Task<DiseaseSummary> GenerateDiseaseSummaryAsync(string diseaseName, string specialty)
    {
        var prompt = EvaluationPrompts.GenerateDiseaseSummary(diseaseName);

        var response = await client.Messages.GetClaudeMessageAsync(new MessageParameters
        {
            Model = AnthropicModels.Claude46Sonnet,
            MaxTokens = 3500,
            Messages = [new Message(RoleType.User, prompt)]
        });

        var json = ClaudeHelpers.ExtractObject(response.Message.ToString());
        return JsonSerializer.Deserialize<DiseaseSummary>(json, JsonOpts)
               ?? throw new Exception("Hastalık özeti oluşturulamadı.");
    }
}
