"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const floatingIcons = [
  { id: 1, emoji: "🩺", size: "text-4xl", style: { top: "12%", left: "8%", animationDuration: "6s", animationDelay: "0s" } },
  { id: 2, emoji: "❤️", size: "text-5xl", style: { top: "20%", left: "15%", animationDuration: "7s", animationDelay: "1s" } },
  { id: 3, emoji: "🧠", size: "text-4xl", style: { bottom: "20%", left: "12%", animationDuration: "8s", animationDelay: "2s" } },
  { id: 4, emoji: "💗", size: "text-3xl", style: { bottom: "35%", left: "6%", animationDuration: "5s", animationDelay: "0.5s" } },
  { id: 5, emoji: "❤️", size: "text-3xl", style: { top: "15%", right: "10%", animationDuration: "7s", animationDelay: "1.5s" } },
  { id: 6, emoji: "⚡", size: "text-4xl", style: { top: "45%", right: "6%", animationDuration: "6s", animationDelay: "3s" } },
  { id: 7, emoji: "💜", size: "text-3xl", style: { bottom: "25%", right: "14%", animationDuration: "9s", animationDelay: "0.8s" } },
];

const PulseLine = ({ color, style }: { color: string; style: React.CSSProperties }) => (
  <svg
    viewBox="0 0 120 40"
    className="absolute w-24 opacity-60"
    style={{ ...style }}
  >
    <polyline
      points="0,20 20,20 30,5 40,35 50,20 60,20 70,8 80,32 90,20 120,20"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", form);
      setAuth(data.token, { fullName: data.fullName, email: data.email, userId: data.userId });
      router.push("/dashboard");
    } catch {
      toast.error("Email veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: "linear-gradient(135deg, #e8e4f8 0%, #f0eeff 40%, #e4eeff 100%)" }}>
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-18px) rotate(5deg); }
          66% { transform: translateY(8px) rotate(-3deg); }
        }
        .float-icon {
          animation: floatUpDown linear infinite;
          position: absolute;
          user-select: none;
          pointer-events: none;
        }
        @keyframes pulseLine {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .pulse-line { animation: pulseLine 3s ease-in-out infinite; }
      `}</style>

      {floatingIcons.map((icon) => (
        <div
          key={icon.id}
          className={`float-icon ${icon.size}`}
          style={{ ...icon.style, animationDuration: icon.style.animationDuration, animationDelay: icon.style.animationDelay }}
        >
          {icon.emoji}
        </div>
      ))}

      <PulseLine color="#a78bfa" style={{ top: "38%", right: "4%", animationDelay: "0s" }} />
      <PulseLine color="#34d399" style={{ bottom: "18%", right: "10%", animationDelay: "1s" }} />
      <div className="pulse-line" style={{ position: "absolute", top: "38%", right: "4%" }} />

      <div className="relative z-10 bg-white rounded-3xl shadow-xl p-10 w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
              🩺
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg viewBox="0 0 20 12" className="w-4 h-3" fill="none">
                <polyline points="0,6 4,6 6,1 8,11 10,6 12,6 14,2 16,10 18,6 20,6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: "#7c3aed" }}>MedPra</h1>
          <p className="text-gray-500 text-sm mb-3">Tıp Eğitim Simülatörü</p>
          <span className="px-4 py-1 rounded-full text-sm font-medium border" style={{ borderColor: "#c4b5fd", color: "#7c3aed", background: "#f5f3ff" }}>
            AI Destekli Hasta Simülasyonu
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 bg-gray-50"
                style={{ focusRingColor: "#7c3aed" } as React.CSSProperties}
                onFocus={(e) => e.target.style.borderColor = "#7c3aed"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Şifre</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 bg-gray-50"
                onFocus={(e) => e.target.style.borderColor = "#7c3aed"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-base mt-2"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            {loading ? "Giriş yapılıyor..." : (
              <>
                Giriş Yap
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabın yok mu?{" "}
          <Link href="/register" className="font-semibold hover:underline" style={{ color: "#7c3aed" }}>
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
