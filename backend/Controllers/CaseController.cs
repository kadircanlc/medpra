using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedPra.Api.Data;
using MedPra.Api.DTOs;
using MedPra.Api.Models;
using MedPra.Api.Services.Interfaces;

namespace MedPra.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CaseController(
    AppDbContext db,
    IPatientService patientService,
    IEvaluationService evaluationService) : ControllerBase
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("start")]
    public async Task<IActionResult> StartCase(StartCaseRequest req)
    {
        var (patient, diseaseId) = await patientService.GeneratePatientAsync(req.Specialty, UserId);

        var session = new CaseSession
        {
            UserId = UserId,
            Specialty = req.Specialty,
            PatientDataJson = JsonSerializer.Serialize(patient, JsonOpts),
            CorrectDiagnosis = patient.CorrectDiagnosis,
            SelectedDiseaseId = diseaseId
        };

        db.CaseSessions.Add(session);
        await db.SaveChangesAsync();

        return Ok(new
        {
            sessionId = session.Id,
            patient = new
            {
                patient.Name,
                patient.Age,
                patient.Gender,
                patient.ChiefComplaint,
                patient.DifficultyLevel,
                patient.Vitals
            },
            specialty = req.Specialty
        });
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat(ChatRequest req)
    {
        var session = await db.CaseSessions.FirstOrDefaultAsync(s => s.Id == req.SessionId && s.UserId == UserId);
        if (session == null) return NotFound();
        if (session.Status == "completed") return BadRequest(new { message = "Bu vaka tamamlandı." });

        var history = JsonSerializer.Deserialize<List<ChatMessage>>(session.ChatHistoryJson, JsonOpts) ?? [];
        var reply = await patientService.RespondAsPatientAsync(session.PatientDataJson, history, req.Message);

        history.Add(new ChatMessage("student", req.Message));
        history.Add(new ChatMessage("patient", reply));
        session.ChatHistoryJson = JsonSerializer.Serialize(history, JsonOpts);
        await db.SaveChangesAsync();

        return Ok(new { reply });
    }

    [HttpGet("chat/{sessionId}")]
    public async Task<IActionResult> GetChatHistory(Guid sessionId)
    {
        var session = await db.CaseSessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == UserId);
        if (session == null) return NotFound();

        var history = JsonSerializer.Deserialize<List<ChatMessage>>(session.ChatHistoryJson, JsonOpts) ?? [];
        return Ok(history);
    }

    [HttpPost("request-tests")]
    public async Task<IActionResult> RequestTests(RequestTestsRequest req)
    {
        var session = await db.CaseSessions.FirstOrDefaultAsync(s => s.Id == req.SessionId && s.UserId == UserId);
        if (session == null) return NotFound();
        if (session.Status == "completed") return BadRequest(new { message = "Bu vaka tamamlandı." });

        var existingResults = JsonSerializer.Deserialize<List<TestResult>>(session.TestResultsJson, JsonOpts) ?? [];
        var newResults = await patientService.GenerateTestResultsAsync(session.PatientDataJson, req.Tests, existingResults);

        var allResults = existingResults.Concat(newResults).ToList();
        session.TestResultsJson = JsonSerializer.Serialize(allResults, JsonOpts);

        var existingTests = JsonSerializer.Deserialize<List<string>>(session.RequestedTestsJson, JsonOpts) ?? [];
        existingTests.AddRange(req.Tests);
        session.RequestedTestsJson = JsonSerializer.Serialize(existingTests, JsonOpts);

        await db.SaveChangesAsync();
        return Ok(new { results = allResults });
    }

    [HttpPost("submit-diagnosis")]
    public async Task<IActionResult> SubmitDiagnosis(SubmitDiagnosisRequest req)
    {
        var session = await db.CaseSessions.FirstOrDefaultAsync(s => s.Id == req.SessionId && s.UserId == UserId);
        if (session == null) return NotFound();
        if (session.Status == "completed") return BadRequest(new { message = "Bu vaka zaten tamamlandı." });

        var history = JsonSerializer.Deserialize<List<ChatMessage>>(session.ChatHistoryJson, JsonOpts) ?? [];
        var chatSummary = history.Count > 0
            ? string.Join(" | ", history.Select(m => $"{(m.Role == "student" ? "Dr" : "Hasta")}: {m.Content[..Math.Min(80, m.Content.Length)]}"))
            : "Hasta ile görüşme yapılmadı.";

        var requestedTests = JsonSerializer.Deserialize<List<string>>(session.RequestedTestsJson, JsonOpts) ?? [];
        var differentials = req.DifferentialDiagnoses ?? new List<string>();
        var evaluation = await evaluationService.EvaluateDiagnosisAsync(
            session.PatientDataJson,
            chatSummary,
            req.Diagnosis,
            req.Treatment,
            session.CorrectDiagnosis,
            requestedTests,
            differentials);

        session.StudentDiagnosis = req.Diagnosis;
        session.StudentTreatment = req.Treatment;
        session.StudentDifferentials = JsonSerializer.Serialize(differentials, JsonOpts);
        session.TimeTakenSeconds = req.TimeTakenSeconds;
        session.IsCorrect = evaluation.IsCorrect;
        session.DiagnosisScore = evaluation.Score;
        session.AiFeedback = evaluation.Feedback;
        session.Status = "completed";
        session.CompletedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return Ok(evaluation);
    }

    [HttpPost("physical-exam")]
    public async Task<IActionResult> PhysicalExam(PhysicalExamRequest req)
    {
        var session = await db.CaseSessions.FirstOrDefaultAsync(s => s.Id == req.SessionId && s.UserId == UserId);
        if (session == null) return NotFound();
        if (session.Status == "completed") return BadRequest(new { message = "Bu vaka tamamlandı." });

        var finding = await patientService.GetPhysicalExamFindingAsync(session.PatientDataJson, req.ExamType);
        return Ok(new PhysicalExamResult(req.ExamType, finding));
    }

    [HttpGet("summary/{sessionId}")]
    public async Task<IActionResult> GetDiseaseSummary(Guid sessionId)
    {
        var session = await db.CaseSessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == UserId);
        if (session == null) return NotFound();
        if (session.Status != "completed") return BadRequest(new { message = "Vaka henüz tamamlanmadı." });

        try
        {
            var summary = await evaluationService.GenerateDiseaseSummaryAsync(session.CorrectDiagnosis, session.Specialty);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, inner = ex.InnerException?.Message });
        }
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var sessions = await db.CaseSessions
            .Where(s => s.UserId == UserId && s.Status == "completed")
            .OrderByDescending(s => s.CompletedAt)
            .Select(s => new
            {
                s.Id, s.Specialty, s.StudentDiagnosis,
                s.CorrectDiagnosis, s.IsCorrect, s.DiagnosisScore, s.CompletedAt
            })
            .Take(20)
            .ToListAsync();

        return Ok(sessions);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var sessions = await db.CaseSessions
            .Where(s => s.UserId == UserId && s.Status == "completed")
            .ToListAsync();

        var total = sessions.Count;
        var correct = sessions.Count(s => s.IsCorrect == true);
        var totalScore = sessions.Sum(s => s.DiagnosisScore ?? 0);

        var bySpecialty = sessions
            .GroupBy(s => s.Specialty)
            .Select(g => new
            {
                specialty = g.Key,
                total = g.Count(),
                correct = g.Count(s => s.IsCorrect == true),
                successRate = g.Count() > 0
                    ? Math.Round((double)g.Count(s => s.IsCorrect == true) / g.Count() * 100, 1)
                    : 0
            });

        var byDisease = sessions
            .GroupBy(s => new { s.CorrectDiagnosis, s.Specialty })
            .Select(g => new
            {
                disease = g.Key.CorrectDiagnosis,
                specialty = g.Key.Specialty,
                total = g.Count(),
                correct = g.Count(s => s.IsCorrect == true),
                successRate = g.Count() > 0
                    ? Math.Round((double)g.Count(s => s.IsCorrect == true) / g.Count() * 100, 1)
                    : 0
            })
            .OrderBy(x => x.specialty).ThenBy(x => x.disease)
            .ToList();

        var weakAreas = byDisease
            .Where(d => d.total >= 2 && d.successRate < 50)
            .OrderBy(d => d.successRate)
            .Take(5)
            .ToList();

        var avgTestEfficiency = sessions
            .Where(s => s.DiagnosisScore.HasValue)
            .Select(s => s.DiagnosisScore!.Value)
            .DefaultIfEmpty(0)
            .Average();

        return Ok(new
        {
            total, correct,
            successRate = total > 0 ? Math.Round((double)correct / total * 100, 1) : 0,
            totalScore,
            avgScore = total > 0 ? Math.Round(avgTestEfficiency, 1) : 0,
            bySpecialty,
            byDisease,
            weakAreas
        });
    }
}
