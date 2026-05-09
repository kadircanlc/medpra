namespace MedPra.Api.Prompts;

public static class EvaluationPrompts
{
    public static string EvaluateDiagnosis(
        string patientSummary, string chatSummary,
        string correctDiagnosis, string studentDiagnosis,
        string studentTreatment, string requestedTests,
        string studentDifferentials) => $$"""
        Tıp öğrencisinin vaka performansını değerlendir.

        Hasta: {{patientSummary}}
        Görüşme özeti: {{chatSummary}}
        Doğru tanı: {{correctDiagnosis}}
        Öğrencinin ayırıcı tanı listesi: {{studentDifferentials}}
        Öğrencinin kesin tanısı: {{studentDiagnosis}}
        Öğrencinin tedavisi: {{studentTreatment}}
        İstenen tetkikler: {{requestedTests}}

        SADECE şu JSON formatında yanıt ver (başka hiçbir şey yazma):
        {
          "isCorrect": true,
          "score": 85,
          "testEfficiencyScore": 70,
          "differentialScore": 80,
          "feedback": "Genel performans değerlendirmesi — ne doğru yaptı, ne kaçırdı, öğrenme noktaları (3-4 cümle)",
          "correctDiagnosis": "Doğru tanı ve kısa gerekçe",
          "correctTreatment": "Temel tedavi adımları (madde madde)",
          "differentialAnalysis": "Öğrencinin ayırıcı tanı listesinin değerlendirmesi — doğru düşünce varsa vurgula, eksik kritik ayırıcı tanıları belirt (2-3 cümle)",
          "correctDifferentials": ["Bu vakanın gerçek ayırıcı tanısı 1 — neden doğru tanı seçildi", "ayırıcı tanı 2 — neden değil"],
          "missedAnamnesis": ["Öğrencinin sormadığı ama sorması gereken kritik soru (varsa)"],
          "testAnalysis": "Tetkik seçiminin genel değerlendirmesi (2-3 cümle)",
          "unnecessaryTests": ["Bu tanı için gereksiz olan test (varsa)"],
          "missingCriticalTests": ["Bu tanı için kritik ama istenmeyen test (varsa)"]
        }

        PUANLAMA KURALLARI:
        score (0-100): Tanı %70+ doğruysa 70-85, tam doğruysa 85-100. Yanlışsa 0-40. Tedavi uygunsa +5-10.
        testEfficiencyScore (0-100): Kritik testler istendi +puan, gereksiz test sayısı fazlaysa -puan. 5'ten az test ve hepsi alakalı ise 90+. Her gereksiz test -5 puan.
        differentialScore (0-100): Kesin tanı ayırıcı tanı listesinde varsa 60+. Liste mantıklı ve sistemli ise 80+. Tamamen alakasız liste ise 10-.
        isCorrect: tanı %70+ doğruysa true.
        missedAnamnesis/unnecessaryTests/missingCriticalTests/correctDifferentials: yoksa boş liste [] döndür.
        """;

    public static string GenerateDiseaseSummary(string diseaseName) => $$"""
        TUS (Tıpta Uzmanlık Sınavı) hazırlığı yapan bir tıp öğrencisi için '{{diseaseName}}' hastalığının kapsamlı özetini oluştur.

        SADECE JSON formatında yanıt ver (başka hiçbir şey yazma):
        {
          "diseaseName": "{{diseaseName}}",
          "classicPresentation": "TUS'ta bu hastalığın tipik hasta sunumu — yaş, cinsiyet, risk faktörleri, başvuru şikayeti (2-3 cümle)",
          "pathognomonicFindings": ["Patognomonik veya çok karakteristik bulgu 1", "bulgu 2", "bulgu 3"],
          "keyTests": ["Anahtar tetkik — beklenen sonuç ve önemi", "tetkik 2 — beklenen sonuç"],
          "firstLineTreatment": "TUS'ta bilinen birinci basamak tedavi protokolü (adım adım)",
          "tusHighlights": ["TUS'ta bu hastalıkla ilgili sık sorulan kritik nokta 1", "nokta 2", "nokta 3", "nokta 4"],
          "idealAnamnesisQuestions": [
            "Bu hastalık için sorulması gereken kritik anamnez sorusu 1",
            "kritik soru 2",
            "kritik soru 3",
            "kritik soru 4"
          ],
          "keyExamFindings": [
            "Bu hastalıkta beklenen fizik muayene bulgusu 1 (hangi sistem, ne bulgusu)",
            "bulgu 2",
            "bulgu 3"
          ],
          "testingStrategy": "Bu tanıya ulaşmak için ideal tetkik sıralaması ve mantığı — hangi test önce, neden, tanı kriteri ne (2-3 cümle)"
        }
        """;
}
