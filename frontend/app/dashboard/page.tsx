"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Stethoscope, Trophy, LogOut, BookOpen, Target, Star, CheckCircle, AlertTriangle } from "lucide-react";

const SPECIALTIES = [
  { id: "Dahiliye", label: "Dahiliye", icon: "🫀", gradient: "from-red-100 to-rose-200", shadow: "shadow-red-100" },
  { id: "Acil", label: "Acil Tıp", icon: "🚨", gradient: "from-orange-100 to-amber-200", shadow: "shadow-orange-100" },
  { id: "Kardiyoloji", label: "Kardiyoloji", icon: "❤️", gradient: "from-pink-100 to-rose-200", shadow: "shadow-pink-100" },
  { id: "Nöroloji", label: "Nöroloji", icon: "🧠", gradient: "from-purple-100 to-violet-200", shadow: "shadow-purple-100" },
  { id: "Göğüs Hastalıkları", label: "Göğüs Hast.", icon: "🫁", gradient: "from-sky-100 to-blue-200", shadow: "shadow-sky-100" },
  { id: "Gastroenteroloji", label: "Gastroenteroloji", icon: "🔬", gradient: "from-emerald-100 to-green-200", shadow: "shadow-emerald-100" },
  { id: "Endokrinoloji", label: "Endokrinoloji", icon: "⚗️", gradient: "from-yellow-100 to-amber-200", shadow: "shadow-yellow-100" },
  { id: "Ortopedi", label: "Ortopedi", icon: "🦴", gradient: "from-slate-100 to-gray-200", shadow: "shadow-slate-100" },
  { id: "Pediatri", label: "Pediatri", icon: "👶", gradient: "from-teal-100 to-cyan-200", shadow: "shadow-teal-100" },
  { id: "Kadın Doğum", label: "Kadın Doğum", icon: "🌸", gradient: "from-fuchsia-100 to-pink-200", shadow: "shadow-fuchsia-100" },
];

interface WeakArea {
  disease: string;
  specialty: string;
  total: number;
  correct: number;
  successRate: number;
}

interface Stats {
  total: number;
  correct: number;
  successRate: number;
  totalScore: number;
  avgScore: number;
  weakAreas: WeakArea[];
}

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
    { label: "Toplam Vaka", value: stats?.total ?? "—", icon: <BookOpen className="w-5 h-5" />, color: "text-indigo-600 bg-indigo-50" },
    { label: "Doğru Tanı", value: stats?.correct ?? "—", icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
    { label: "Başarı Oranı", value: stats ? `%${stats.successRate}` : "—", icon: <Target className="w-5 h-5" />, color: "text-blue-600 bg-blue-50" },
    { label: "Ort. Puan", value: stats ? stats.avgScore : "—", icon: <Star className="w-5 h-5" />, color: "text-yellow-600 bg-yellow-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Stethoscope className="text-indigo-600 w-6 h-6" />
            <span className="font-bold text-gray-900 text-lg">MedPra</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/leaderboard")}
              className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 text-sm font-medium transition"
            >
              <Trophy className="w-4 h-4" />
              Skor Tablosu
            </button>
            <span className="text-gray-400 text-sm hidden sm:block">{user?.fullName}</span>
            <button onClick={() => { logout(); router.push("/login"); }} className="text-gray-400 hover:text-red-500 transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* İstatistik kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.color}`}>{s.icon}</div>
              <div>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Zayıf alanlar */}
        {stats && stats.weakAreas.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="font-bold text-red-800">Zayıf Alanlar</h2>
              <span className="text-xs text-red-500 ml-1">— tekrar çalışman gereken hastalıklar</span>
            </div>
            <div className="space-y-2">
              {stats.weakAreas.map((w, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 shadow-sm">
                  <div>
                    <span className="font-medium text-gray-900 text-sm">{w.disease}</span>
                    <span className="text-gray-400 text-xs ml-2">{w.specialty}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{w.correct}/{w.total} doğru</span>
                    <span className={`text-sm font-bold ${w.successRate < 25 ? "text-red-600" : "text-orange-500"}`}>
                      %{w.successRate}
                    </span>
                    <button
                      onClick={() => startCase(w.specialty)}
                      disabled={starting !== null}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1 rounded-lg font-medium transition disabled:opacity-50"
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
            <h2 className="text-xl font-bold text-gray-900">Branş Seç</h2>
            <p className="text-gray-500 text-sm mt-1">Pratik yapmak istediğin branşı seç, AI sana gerçekçi bir hasta vakası oluşturacak.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SPECIALTIES.map(s => {
              const isStarting = starting === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => startCase(s.id)}
                  disabled={starting !== null}
                  className={`
                    relative bg-gradient-to-br ${s.gradient}
                    rounded-2xl p-5 text-left border border-white/60
                    shadow-md ${s.shadow}
                    hover:scale-105 hover:shadow-lg
                    disabled:opacity-60 disabled:scale-100
                    transition-all duration-200
                  `}
                >
                  <div className="text-4xl mb-3 leading-none">{s.icon}</div>
                  <div className="font-bold text-base leading-tight text-gray-900">{s.label}</div>
                  {isStarting && (
                    <div className="absolute inset-0 rounded-2xl bg-white/40 flex items-center justify-center">
                      <div className="text-xs font-semibold text-center px-2 text-gray-900">
                        Vaka<br />oluşturuluyor...
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
