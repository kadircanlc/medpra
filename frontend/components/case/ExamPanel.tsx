"use client";
import { ExamResult } from "./types";
import { EXAM_CATEGORIES } from "./constants";

interface ExamPanelProps {
  examResults: ExamResult[];
  loadingExam: boolean;
  onExamRequest: (examType: string) => void;
}

export default function ExamPanel({ examResults, loadingExam, onExamRequest }: ExamPanelProps) {
  return (
    <div className="h-[calc(100vh-220px)] overflow-y-auto space-y-3">
      {examResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b text-sm font-semibold text-gray-700">Muayene Bulguları</div>
          <div className="divide-y">
            {examResults.map((r, i) => (
              <div key={i} className="px-4 py-3">
                <div className="text-xs font-semibold text-indigo-600 mb-1">{r.examType}</div>
                <p className="text-sm text-gray-800">{r.finding}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loadingExam && (
        <div className="bg-white rounded-xl p-4 text-sm text-gray-500 italic text-center">
          Muayene yapılıyor...
        </div>
      )}

      {EXAM_CATEGORIES.map(cat => (
        <div key={cat.label} className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b text-sm font-semibold text-gray-700">{cat.label}</div>
          <div className="px-4 py-3 flex flex-wrap gap-2">
            {cat.types.map(t => {
              const done = examResults.some(r => r.examType === t);
              return (
                <button
                  key={t}
                  onClick={() => onExamRequest(t)}
                  disabled={done || loadingExam}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    done
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  {done ? "✓ " : ""}{t}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
