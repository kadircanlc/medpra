using System.Text.Json;

namespace MedPra.Api.Services.Helpers;

public static class ClaudeHelpers
{
    public static string ExtractObject(string text) => ExtractBalanced(text, '{', '}');
    public static string ExtractArray(string text) => ExtractBalanced(text, '[', ']');

    public static string SummarizePatient(string patientJson)
    {
        try
        {
            using var doc = JsonDocument.Parse(patientJson);
            var r = doc.RootElement;
            string Get(string p) => r.TryGetProperty(p, out var v) ? v.ToString() : "";
            return $"{Get("name")}, {Get("age")} yaş {Get("gender")}. " +
                   $"Şikayet: {Get("chiefComplaint")}. " +
                   $"Hikaye: {Get("presentIllness")}. " +
                   $"FM: {Get("physicalExam")}. Tanı: {Get("correctDiagnosis")}";
        }
        catch { return patientJson[..Math.Min(600, patientJson.Length)]; }
    }

    private static string ExtractBalanced(string text, char open, char close)
    {
        int start = -1;
        for (int i = 0; i < text.Length; i++)
            if (text[i] == open) { start = i; break; }

        if (start < 0) return open == '[' ? "[]" : "{}";

        int depth = 0;
        bool inString = false;
        bool escaped = false;

        for (int i = start; i < text.Length; i++)
        {
            char c = text[i];
            if (escaped) { escaped = false; continue; }
            if (c == '\\' && inString) { escaped = true; continue; }
            if (c == '"') { inString = !inString; continue; }
            if (inString) continue;
            if (c == open) depth++;
            else if (c == close) { depth--; if (depth == 0) return text[start..(i + 1)]; }
        }

        return text[start..].Trim();
    }
}
