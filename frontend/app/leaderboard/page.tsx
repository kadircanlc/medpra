"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Trophy, ArrowLeft, Medal } from "lucide-react";

interface Entry {
  fullName: string;
  totalCases: number;
  correctCases: number;
  successRate: number;
  totalScore: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/score/leaderboard")
      .then(({ data }) => setEntries(data))
      .finally(() => setLoading(false));
  }, []);

  const medalColor = (i: number) => {
    if (i === 0) return "text-yellow-500";
    if (i === 1) return "text-gray-400";
    if (i === 2) return "text-amber-600";
    return "text-gray-300";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h1 className="font-bold text-gray-900">Skor Tablosu</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center text-gray-500 py-12">Yükleniyor...</div>
        ) : entries.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Henüz sonuç yok.</div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <div key={i} className={`bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 ${i < 3 ? "border-2 border-yellow-100" : ""}`}>
                <div className="w-8 text-center">
                  <Medal className={`w-6 h-6 mx-auto ${medalColor(i)}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{entry.fullName}</div>
                  <div className="text-xs text-gray-500">
                    {entry.totalCases} vaka • {entry.correctCases} doğru
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-600">{entry.totalScore} puan</div>
                  <div className={`text-sm font-medium ${entry.successRate >= 70 ? "text-green-600" : entry.successRate >= 50 ? "text-orange-500" : "text-red-500"}`}>
                    %{entry.successRate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
