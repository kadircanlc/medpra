"use client";
import { useState } from "react";
import { Send, FlaskConical, ChevronRight, ListChecks } from "lucide-react";
import { TestResult } from "./types";

interface DiagnosisPanelProps {
  testResults: TestResult[];
  diagnosis: string;
  treatment: string;
  differentials: string[];
  submitting: boolean;
  onDiagnosisChange: (v: string) => void;
  onTreatmentChange: (v: string) => void;
  onDifferentialsChange: (v: string[]) => void;
  onSubmit: () => void;
  onGoToTests: () => void;
}

export default function DiagnosisPanel({
  testResults, diagnosis, treatment, differentials, submitting,
  onDiagnosisChange, onTreatmentChange, onDifferentialsChange, onSubmit, onGoToTests,
}: DiagnosisPanelProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const updateDiff = (index: number, value: string) => {
    const next = [...differentials];
    next[index] = value;
    onDifferentialsChange(next);
  };

  if (testResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <FlaskConical className="w-12 h-12 text-gray-300 mb-3" />
        <h3 className="font-semibold text-gray-700 mb-1">Tetkik Sonucu Yok</h3>
        <p className="text-sm text-gray-500">
          Tanı koymadan önce en az bir tetkik istemeniz gerekmektedir.
        </p>
        <button onClick={onGoToTests} className="mt-4 text-indigo-600 text-sm font-medium hover:underline">
          Tetkik İste →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-[calc(100vh-220px)] overflow-y-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 px-1">
        <button
          onClick={() => setStep(1)}
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition ${
            step === 1 ? "bg-indigo-100 text-indigo-700" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <ListChecks className="w-4 h-4" />
          Ayırıcı Tanı
        </button>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <button
          onClick={() => setStep(2)}
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition ${
            step === 2 ? "bg-indigo-100 text-indigo-700" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Send className="w-4 h-4" />
          Kesin Tanı
        </button>
      </div>

      {step === 1 && (
        <>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Ayırıcı Tanı Listesi
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Klinik tabloya uyan olası tanıları önem sırasına göre listele (en az 1, en fazla 3)
            </p>
            <div className="space-y-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400 w-4">{i + 1}.</span>
                  <input
                    type="text"
                    value={differentials[i] ?? ""}
                    onChange={e => updateDiff(i, e.target.value)}
                    placeholder={i === 0 ? "En olası tanı (zorunlu)" : `${i + 1}. ayırıcı tanı (opsiyonel)`}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!differentials[0]?.trim()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition disabled:opacity-40"
          >
            Kesin Tanıya Geç
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          {differentials.filter(Boolean).length > 0 && (
            <div className="bg-indigo-50 rounded-xl px-4 py-3 flex flex-wrap gap-2">
              <span className="text-xs text-indigo-500 font-medium w-full mb-1">Ayırıcı tanıların:</span>
              {differentials.filter(Boolean).map((d, i) => (
                <span key={i} className="bg-white border border-indigo-200 text-indigo-700 text-xs px-2 py-1 rounded-lg">
                  {i + 1}. {d}
                </span>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Kesin Tanı</label>
            <input
              type="text"
              value={diagnosis}
              onChange={e => onDiagnosisChange(e.target.value)}
              placeholder="Örn: Akut Miyokard Enfarktüsü, Pnömoni..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Tedavi Planı</label>
            <textarea
              value={treatment}
              onChange={e => onTreatmentChange(e.target.value)}
              placeholder="Tedavi adımlarını yazın..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={submitting || !diagnosis.trim() || !treatment.trim()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Değerlendiriliyor..." : "Tanıyı Gönder"}
          </button>
        </>
      )}
    </div>
  );
}
