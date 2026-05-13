"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Stethoscope, Brain, Heart, Zap, Mail, Lock, ArrowRight } from "lucide-react";

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
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 50%, #e0e7ff 100%)" }}
    >
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50% { transform: translateY(-14px) rotate(-3deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-24px) rotate(8deg); }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.65; }
        }
      `}</style>

      {/* Sol floating ikonlar */}
      <div className="absolute" style={{ top: "18%", left: "9%", animation: "float1 7s ease-in-out infinite" }}>
        <Heart className="w-12 h-12 fill-current" style={{ color: "#f87171" }} />
      </div>
      <div className="absolute" style={{ top: "42%", left: "5%", animation: "float2 5s ease-in-out infinite" }}>
        <Heart className="w-8 h-8 fill-current" style={{ color: "#fb7185" }} />
      </div>
      <div className="absolute" style={{ bottom: "28%", left: "8%", animation: "float3 8s ease-in-out infinite" }}>
        <Stethoscope className="w-10 h-10" style={{ color: "#60a5fa" }} strokeWidth={1.5} />
      </div>
      <div className="absolute" style={{ bottom: "14%", left: "20%", animation: "float4 6s ease-in-out infinite" }}>
        <Brain className="w-10 h-10" style={{ color: "#c084fc" }} strokeWidth={1.5} />
      </div>

      {/* Sağ floating ikonlar */}
      <div className="absolute" style={{ top: "14%", right: "9%", animation: "float2 6s ease-in-out infinite" }}>
        <Heart className="w-10 h-10 fill-current" style={{ color: "#fda4af" }} />
      </div>
      <div className="absolute" style={{ top: "44%", right: "5%", animation: "float1 7s ease-in-out infinite 1s" }}>
        <Zap className="w-9 h-9 fill-current" style={{ color: "#fbbf24" }} />
      </div>

      {/* EKG çizgileri */}
      <svg
        viewBox="0 0 140 45"
        className="absolute w-32"
        style={{ top: "35%", right: "3%", animation: "pulseOpacity 3s ease-in-out infinite" }}
      >
        <polyline
          points="0,22 25,22 35,6 45,38 55,22 70,22 80,9 90,35 100,22 140,22"
          fill="none" stroke="#a78bfa" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
      <svg
        viewBox="0 0 140 45"
        className="absolute w-32"
        style={{ bottom: "16%", right: "9%", animation: "pulseOpacity 3.5s ease-in-out infinite 1s" }}
      >
        <polyline
          points="0,22 25,22 35,6 45,38 55,22 70,22 80,9 90,35 100,22 140,22"
          fill="none" stroke="#34d399" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>

      {/* Kart */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-purple-100 p-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(145deg, #8b5cf6, #6d28d9)" }}
            >
              <Stethoscope className="w-9 h-9 text-white" strokeWidth={1.8} />
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 20 12" className="w-4 h-3" fill="none">
                <polyline points="0,6 3,6 5.5,1 8,11 10,6 12,6 14,2 16,10 17.5,6 20,6"
                  stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: "#7c3aed" }}>MedPra</h1>
          <p className="text-gray-400 text-sm mb-3">Tıp Eğitim Simülatörü</p>
          <span
            className="px-5 py-1.5 rounded-full text-sm font-medium"
            style={{ background: "#f0ebff", color: "#7c3aed", border: "1px solid #ddd6fe" }}
          >
            AI Destekli Hasta Simülasyonu
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-2xl pl-12 pr-4 py-4 text-gray-700 placeholder-gray-300 transition-all outline-none"
                style={{ background: "#fafafa", border: "1.5px solid #e5e7eb" }}
                onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-2xl pl-12 pr-4 py-4 text-gray-700 placeholder-gray-300 transition-all outline-none"
                style={{ background: "#fafafa", border: "1.5px solid #e5e7eb" }}
                onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-4 rounded-2xl transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-base mt-1"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}
          >
            {loading ? (
              "Giriş yapılıyor..."
            ) : (
              <>
                Giriş Yap
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Hesabın yok mu?{" "}
          <Link href="/register" className="font-semibold hover:underline" style={{ color: "#7c3aed" }}>
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
