# MedPra — Proje Bağlamı

## Genel Bakış
TUS (Türk Tıp Uzmanlık Sınavı) adayları için AI destekli hasta vaka simülatörü.

## Stack
- **Backend:** C# / .NET 9.0, ASP.NET Core, EF Core 9, JWT auth, BCrypt
- **AI:** Anthropic Claude API — `AnthropicClient` singleton olarak DI'da
- **Veritabanı:** PostgreSQL (Supabase)
- **Frontend:** Next.js 16.2.6, React 19, TypeScript, TailwindCSS 4, Zustand, Axios

## Dizin Yapısı
```
medpra/
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── CaseController.cs
│   │   ├── DiseaseController.cs   ← GET/POST/PATCH/DELETE /api/disease
│   │   └── ScoreController.cs
│   ├── Services/
│   │   ├── Interfaces/            → IPatientService, IEvaluationService
│   │   ├── Helpers/               → ClaudeHelpers (JSON parse, SummarizePatient)
│   │   ├── PatientService.cs      → hasta üretimi (DB'den hastalık), chat, tetkik, fizik muayene
│   │   ├── EvaluationService.cs   → tanı değerlendirme, hastalık özeti
│   │   ├── DiseasePool.cs         → seed verisi (All: IReadOnlyDictionary)
│   │   └── TokenService.cs
│   ├── Prompts/
│   │   ├── PatientPrompts.cs
│   │   └── EvaluationPrompts.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── CaseSession.cs
│   │   └── Disease.cs             ← yeni (Id, Specialty, Name, IsActive)
│   ├── Data/AppDbContext.cs        → Users, CaseSessions, Diseases
│   ├── DTOs/
│   │   ├── CaseDtos.cs
│   │   ├── AuthDtos.cs
│   │   └── DiseaseDtos.cs         ← yeni
│   ├── Migrations/
│   └── Program.cs                 → startup: migrate + seed diseases
└── frontend/
    ├── app/
    │   ├── (auth)/login, register
    │   ├── dashboard/
    │   ├── case/page.tsx          → ince orkestratör (~130 satır)
    │   └── leaderboard/
    ├── components/
    │   └── case/
    │       ├── types.ts           → ortak TS tipleri
    │       ├── constants.ts       → TEST_CATEGORIES, EXAM_CATEGORIES
    │       ├── PatientHeader.tsx
    │       ├── ChatPanel.tsx
    │       ├── TestPanel.tsx
    │       ├── ExamPanel.tsx
    │       ├── DiagnosisPanel.tsx
    │       └── EvaluationView.tsx
    ├── store/authStore.ts
    └── lib/api.ts
```

## Mimari Kararlar
- `AnthropicClient` → Singleton
- `IPatientService`, `IEvaluationService` → Scoped
- Hastalıklar DB'de (`Disease` tablosu); startup'ta DiseasePool.All ile seed edilir (tek seferlik)
- Prompt'lar `Prompts/` klasöründe static metodlar
- `ClaudeHelpers` paylaşımlı JSON parse yardımcısı
- Frontend state CaseContent'te tutulur, paneller props ile çalışır

## Açık Görevler
- [ ] Aşama 3: CaseSession JSON blob'ları normalize et (ChatMessage, TestResult ayrı tablolar)
- [ ] İleride: TUS PDF entegrasyonu — gerçek TUS vaka verileri DB'ye yüklenip Claude'a context olarak verilecek (şu an Claude kendi tıp bilgisini kullanıyor)
