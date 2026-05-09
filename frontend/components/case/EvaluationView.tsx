"use client";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Evaluation, DiseaseSummary } from "./types";

interface EvaluationViewProps {
  evaluation: Evaluation;
  timeTakenSeconds: number;
  summary: DiseaseSummary | null;
  loadingSummary: boolean;
  onLoadSummary: () => void;
  onNewCase: () => void;
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={radius} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#111827">{score}</text>
      </svg>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function EvaluationView({
  evaluation, timeTakenSeconds, summary, loadingSummary, onLoadSummary, onNewCase,
}: EvaluationViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Sonuç başlığı */}
        <div className={`rounded-2xl p-5 border-2 ${evaluation.isCorrect ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {evaluation.isCorrect
                ? <CheckCircle className="w-8 h-8 text-green-600" />
                : <XCircle className="w-8 h-8 text-red-600" />
              }
              <div>
                <div className={`text-xl font-bold ${evaluation.isCorrect ? "text-green-800" : "text-red-800"}`}>
                  {evaluation.isCorrect ? "Doğru Tanı!" : "Yanlış Tanı"}
                </div>
                <div className="text-gray-600 text-sm flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(timeTakenSeconds)} sürede tamamlandı
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Puan halkaları */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Performans Puanları</h3>
          <div className="flex justify-around">
            <ScoreRing score={evaluation.score} label="Genel Puan" color="#6366f1" />
            <ScoreRing score={evaluation.testEfficiencyScore} label="Tetkik Verimliliği" color="#10b981" />
            <ScoreRing score={evaluation.differentialScore} label="Ayırıcı Tanı" color="#f59e0b" />
          </div>
        </div>

        {/* Genel geri bildirim */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Geri Bildirim</h3>
          <p className="text-gray-800 text-sm leading-relaxed">{evaluation.feedback}</p>
        </div>

        {/* Doğru tanı ve tedavi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Doğru Tanı</h3>
            <p className="text-gray-800 text-sm">{evaluation.correctDiagnosis}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Doğru Tedavi</h3>
            <p className="text-gray-800 text-sm">{evaluation.correctTreatment}</p>
          </div>
        </div>

        {/* Ayırıcı tanı analizi */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 mb-2">Ayırıcı Tanı Değerlendirmesi</h3>
          <p className="text-sm text-amber-700 mb-3 leading-relaxed">{evaluation.differentialAnalysis}</p>
          {evaluation.correctDifferentials.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-amber-600 mb-1.5">Bu vakanın doğru ayırıcı tanıları:</div>
              <ul className="space-y-1">
                {evaluation.correctDifferentials.map((d, i) => (
                  <li key={i} className="text-xs text-amber-800 flex gap-2">
                    <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sorulmayan kritik sorular */}
        {evaluation.missedAnamnesis.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h3 className="font-semibold text-orange-800 mb-2">Sorulmayan Kritik Sorular</h3>
            <ul className="space-y-1.5">
              {evaluation.missedAnamnesis.map((m, i) => (
                <li key={i} className="text-sm text-orange-700 flex gap-2">
                  <span className="mt-0.5 shrink-0">⚠</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tetkik analizi */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Tetkik Analizi</h3>
          <p className="text-sm text-gray-700 mb-3">{evaluation.testAnalysis}</p>
          {evaluation.missingCriticalTests.length > 0 && (
            <div className="mb-2">
              <div className="text-xs font-semibold text-red-600 mb-1">İstenmeyen Kritik Tetkikler</div>
              {evaluation.missingCriticalTests.map((t, i) => (
                <div key={i} className="text-xs text-red-700 flex gap-1.5"><span>•</span><span>{t}</span></div>
              ))}
            </div>
          )}
          {evaluation.unnecessaryTests.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-orange-600 mb-1">Gereksiz Tetkikler</div>
              {evaluation.unnecessaryTests.map((t, i) => (
                <div key={i} className="text-xs text-orange-700 flex gap-1.5"><span>•</span><span>{t}</span></div>
              ))}
            </div>
          )}
        </div>

        {/* TUS Hastalık Özeti */}
        {!summary ? (
          <button
            onClick={onLoadSummary}
            disabled={loadingSummary}
            className="w-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-medium py-3 rounded-xl transition disabled:opacity-50"
          >
            {loadingSummary ? "Yükleniyor..." : "📚 TUS Hastalık Özeti & İdeal Yaklaşım"}
          </button>
        ) : (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-4">
            <h3 className="font-bold text-indigo-900">{summary.diseaseName} — TUS Özeti</h3>

            <div>
              <div className="text-xs font-semibold text-indigo-700 mb-1">Klasik Sunum</div>
              <p className="text-sm text-gray-800">{summary.classicPresentation}</p>
            </div>

            <div>
              <div className="text-xs font-semibold text-indigo-700 mb-1">Patognomonik Bulgular</div>
              {summary.pathognomonicFindings.map((f, i) => (
                <div key={i} className="text-sm text-gray-800 flex gap-1.5"><span className="text-indigo-400">•</span><span>{f}</span></div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-blue-700 mb-1.5">İdeal Anamnez Soruları</div>
              {summary.idealAnamnesisQuestions.map((q, i) => (
                <div key={i} className="text-sm text-blue-800 flex gap-1.5 mb-0.5">
                  <span className="text-blue-400 shrink-0">?</span><span>{q}</span>
                </div>
              ))}
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-teal-700 mb-1.5">Fizik Muayenede Aranan Bulgular</div>
              {summary.keyExamFindings.map((f, i) => (
                <div key={i} className="text-sm text-teal-800 flex gap-1.5"><span className="text-teal-400">•</span><span>{f}</span></div>
              ))}
            </div>

            <div>
              <div className="text-xs font-semibold text-indigo-700 mb-1">Anahtar Tetkikler</div>
              {summary.keyTests.map((t, i) => (
                <div key={i} className="text-sm text-gray-800 flex gap-1.5"><span className="text-indigo-400">•</span><span>{t}</span></div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-green-700 mb-1">İdeal Tetkik Stratejisi</div>
              <p className="text-sm text-green-800">{summary.testingStrategy}</p>
            </div>

            <div>
              <div className="text-xs font-semibold text-indigo-700 mb-1">Birinci Basamak Tedavi</div>
              <p className="text-sm text-gray-800">{summary.firstLineTreatment}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-yellow-800 mb-1">TUS&apos;ta Sık Sorulanlar</div>
              {summary.tusHighlights.map((h, i) => (
                <div key={i} className="text-sm text-yellow-800 flex gap-1.5"><span>★</span><span>{h}</span></div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onNewCase}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition"
        >
          Yeni Vaka
        </button>
      </div>
    </div>
  );
}
