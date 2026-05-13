"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Stethoscope, Trophy, LogOut, BookOpen, Target, Star, CheckCircle, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";

const SPECIALTIES = [
  { id: "Dahiliye",           label: "Dahiliye",        icon: "🫀", color: "#fef2f2", border: "#fecaca", text: "#dc2626" },
  { id: "Acil",               label: "Acil Tıp",        icon: "🚑", color: "#fffbeb", border: "#fde68a", text: "#d97706" },
  { id: "Kardiyoloji",        label: "Kardiyoloji",     icon: "❤️", color: "#fff1f2", border: "#fecdd3", text: "#e11d48" },
  { id: "Nöroloji",           label: "Nöroloji",        icon: "🧠", color: "#faf5ff", border: "#e9d5ff", text: "#7c3aed" },
  { id: "Göğüs Hastalıkları", label: "Göğüs Hast.",    icon: "🫁", color: "#eff6ff", border: "#bfdbfe", text: "#2563eb" },
  { id: "Gastroenteroloji",   label: "Gastroenteroloji",icon: "🔬", color: "#f0fdf4", border: "#bbf7d0", text: "#16a34a" },
  { id: "Endokrinoloji",      label: "Endokrinoloji",   icon: "⚗️", color: "#fefce8", border: "#fef08a", text: "#ca8a04" },
  { id: "Ortopedi",           label: "Ortopedi",        icon: "🦴", color: "#f8fafc", border: "#e2e8f0", text: "#475569" },
  { id: "Pediatri",           label: "Pediatri",        icon: "👶", color: "#f0fdfa", border: "#99f6e4", text: "#0d9488" },
  { id: "Kadın Doğum",        label: "Kadın Doğum",     icon: "🌸", color: "#fdf4ff", border: "#f0abfc", text: "#a21caf" },
];

interface WeakArea { disease: string; specialty: string; total: number; correct: number; successRate: number; }
interface Stats { total: number; correct: number; successRate: number; totalScore: number; avgScore: number; weakAreas: WeakArea[]; }

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    api.get("/api/case/stats").then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const startCase = async (specialty: string) => {
    setStarting(specialty);
    try {
      const { data } = await api.post("/api/case/start", { specialty });
      sessionStorage.setItem(`patient_${data.sessionId}`, JSON.stringify(data.patient));
      router.push(`/case?session=${data.sessionId}`);
    } catch {
      toast.error("Vaka başlatılamadı. Tekrar deneyin.");
      setStarting(null);
    }
  };

  const statCards = [
    { label: "Toplam Vaka",  value: stats?.total ?? "—",                  icon: <BookOpen className="w-5 h-5" />,    bg: "#f5f3ff", iconColor: "#7c3aed" },
    { label: "Doğru Tanı",  value: stats?.correct ?? "—",                 icon: <CheckCircle className="w-5 h-5" />, bg: "#f0fdf4", iconColor: "#16a34a" },
    { label: "Başarı Oranı",value: stats ? `%${stats.successRate}` : "—", icon: <Target className="w-5 h-5" />,      bg: "#eff6ff", iconColor: "#2563eb" },
    { label: "Ort. Puan",   value: stats ? stats.avgScore : "—",          icon: <Star className="w-5 h-5" />,        bg: "#fffbeb", iconColor: "#d97706" },
  ];

  const firstName = user?.fullName?.split(" ")[0] ?? "Doktor";

  return (
    <div className="min-h-screen" style={{ background: "#f8f7ff" }}>

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-20" style={{ borderColor: "#ede9fe" }}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
              <Stethoscope className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-lg" style={{ color: "#7c3aed" }}>MedPra</span>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => router.push("/leaderboard")}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "#6b7280" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#7c3aed")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
            >
              <Trophy className="w-4 h-4" />
              Skor Tablosu
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}>
                {firstName[0]}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.fullName}</span>
            </div>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Hero */}
        <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 60%,#5b21b6 100%)" }}>
          <div className="absolute inset-0 opacity-10">
            <svg className="absolute right-0 top-0 w-64 h-64" viewBox="0 0 200 200" fill="none">
              <circle cx="150" cy="50" r="80" fill="white" />
              <circle cx="60" cy="160" r="50" fill="white" />
            </svg>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-purple-300 text-sm font-medium">AI Destekli Eğitim</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Hoşgeldin, {firstName} 👋</h1>
              <p className="text-purple-200 text-sm">Bir branş seç, AI sana gerçekçi bir hasta vakası oluştursun.</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              {stats && (
                <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-3 text-center">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-purple-200 text-xs mt-0.5">Tamamlanan Vaka</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stat kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4" style={{ border: "1px solid #f3f0ff" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.iconColor }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 leading-none">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Zayıf alanlar */}
        {stats && stats.weakAreas.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid #fee2e2" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Zayıf Alanlar</h2>
                <p className="text-xs text-gray-400">Tekrar çalışman gereken hastalıklar</p>
              </div>
            </div>
            <div className="space-y-2">
              {stats.weakAreas.map((w, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "#fafafa" }}>
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">{w.disease}</span>
                    <span className="text-gray-400 text-xs ml-2">{w.specialty}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{w.correct}/{w.total} doğru</span>
                    <span className="text-sm font-bold" style={{ color: w.successRate < 25 ? "#dc2626" : "#ea580c" }}>%{w.successRate}</span>
                    <button
                      onClick={() => startCase(w.specialty)}
                      disabled={starting !== null}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                      style={{ background: "#fef2f2", color: "#dc2626" }}
                    >
                      Tekrar Dene
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Branş seçimi */}
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">Branş Seç</h2>
            <p className="text-gray-400 text-sm mt-0.5">Hangi alanda pratik yapmak istiyorsun?</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SPECIALTIES.map(s => {
              const isStarting = starting === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => startCase(s.id)}
                  disabled={starting !== null}
                  className="relative group rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg disabled:opacity-60 disabled:translate-y-0 disabled:shadow-none"
                  style={{ background: s.color, border: `1.5px solid ${s.border}` }}
                >
                  <div className="text-3xl mb-3 leading-none">{s.icon}</div>
                  <div className="font-bold text-sm leading-tight text-gray-800">{s.label}</div>
                  <ChevronRight
                    className="absolute right-3 bottom-3 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: s.text }}
                  />
                  {isStarting && (
                    <div className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-xs font-semibold text-center" style={{ color: s.text }}>
                        Oluşturuluyor...
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
