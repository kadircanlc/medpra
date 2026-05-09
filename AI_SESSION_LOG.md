# AI Oturum Günlüğü

## 2026-05-09 — Dashboard & Yeni Branşlar

### Değişiklikler
- DiseasePool'a Pediatri (34 hastalık) ve Kadın Doğum (33 hastalık) eklendi
- Seed mantığı düzeltildi: "DB boşsa" → "bu branşa ait kayıt yoksa" (yeni branş eklenince otomatik seed)
- `DiseaseController`'a `GET /api/disease/counts` endpoint'i eklendi (branş → hastalık sayısı)
- Dashboard yeniden tasarlandı: gradient kartlar, hastalık sayısı gösterimi, 5 sütunlu grid, stat kartları

---

## 2026-05-09 — Aşama 2: DiseasePool → DB & Frontend Bileşenleştirme

### Backend
- `Models/Disease.cs` oluşturuldu (Id, Specialty, Name, IsActive)
- `AppDbContext.cs` güncellendi — `DbSet<Disease>` eklendi
- EF Core migrasyonu oluşturuldu: `AddDiseasesTable`
- `DiseasePool.cs` güncellendi — `Pool` private → `All` public (seed kaynağı olarak korundu, `Pick()` kaldırıldı)
- `PatientService.cs` güncellendi — `DiseasePool.Pick()` yerine DB sorgusu kullanıyor
- `DTOs/DiseaseDtos.cs` oluşturuldu (AddDiseaseRequest, DiseaseDto)
- `Controllers/DiseaseController.cs` oluşturuldu:
  - `GET /api/disease?specialty=X` — hastalık listesi
  - `GET /api/disease/specialties` — uzmanlık listesi
  - `POST /api/disease` — hastalık ekle (authorized)
  - `PATCH /api/disease/{id}/toggle` — aktif/pasif (authorized)
  - `DELETE /api/disease/{id}` — sil (authorized)
- `Program.cs` güncellendi — startup'ta DB boşsa DiseasePool.All ile seed yapılıyor

### Frontend
- `components/case/types.ts` — ortak tipler (Patient, ChatMsg, TestResult, ExamResult, Evaluation, DiseaseSummary)
- `components/case/constants.ts` — TEST_CATEGORIES, EXAM_CATEGORIES
- `components/case/PatientHeader.tsx` — hasta başlığı + VitalBadge
- `components/case/ChatPanel.tsx` — chat arayüzü
- `components/case/TestPanel.tsx` — tetkik seçimi ve sonuçları
- `components/case/ExamPanel.tsx` — fizik muayene
- `components/case/DiagnosisPanel.tsx` — tanı & tedavi formu
- `components/case/EvaluationView.tsx` — değerlendirme ve TUS özeti ekranı
- `app/case/page.tsx` yeniden yazıldı — sadece state + API çağrıları + bileşen yönlendirme (~130 satır)

### Build durumu
- Backend: `dotnet build` → 0 hata, 0 uyarı
- Frontend: `tsc --noEmit` → 0 hata

### Sonraki adımlar (Aşama 3 planı)
- CaseSession JSON blob'ları → ayrı tablolara normalize et (ChatMessage, TestResult tabloları)

---

## 2026-05-09 — Aşama 1: Mimari Refactor

### Yapılan değişiklikler
- `ClaudeService.cs` silindi (tek tanrı sınıfı)
- `Services/Interfaces/IPatientService.cs` oluşturuldu
- `Services/Interfaces/IEvaluationService.cs` oluşturuldu
- `Services/Helpers/ClaudeHelpers.cs` oluşturuldu (ExtractObject, ExtractArray, SummarizePatient)
- `Prompts/PatientPrompts.cs` oluşturuldu (GeneratePatient, RespondAsPatientSystem, GenerateTestResults, GetPhysicalExam)
- `Prompts/EvaluationPrompts.cs` oluşturuldu (EvaluateDiagnosis, GenerateDiseaseSummary)
- `Services/PatientService.cs` oluşturuldu — IPatientService implement eder
- `Services/EvaluationService.cs` oluşturuldu — IEvaluationService implement eder
- `Controllers/CaseController.cs` güncellendi — ClaudeService yerine IPatientService + IEvaluationService inject
- `Program.cs` güncellendi — AnthropicClient singleton, IPatientService/IEvaluationService Scoped olarak kayıtlı

### Build durumu
`dotnet build` → 0 hata, 0 uyarı

---

## 2026-05-09 — Oturum Başlatma
- Konuşma bağlamı kaybolduğundan proje yeniden keşfedildi
- PROJECT_CONTEXT.md ve AI_SESSION_LOG.md oturum bağlamı dosyaları oluşturuldu
