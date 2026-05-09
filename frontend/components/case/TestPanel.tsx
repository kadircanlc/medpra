"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TestResult } from "./types";
import { TEST_CATEGORIES } from "./constants";

interface TestPanelProps {
  selectedTests: string[];
  testResults: TestResult[];
  loadingTests: boolean;
  onToggleTest: (t: string) => void;
  onRequestTests: () => void;
}

export default function TestPanel({
  selectedTests, testResults, loadingTests, onToggleTest, onRequestTests,
}: TestPanelProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <div className="h-[calc(100vh-220px)] overflow-y-auto space-y-3">
      {selectedTests.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-indigo-800">{selectedTests.length} tetkik seçildi</span>
            <button
              onClick={onRequestTests}
              disabled={loadingTests}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            >
              {loadingTests ? "İsteniyor..." : "İste"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedTests.map(t => (
              <span
                key={t}
                onClick={() => onToggleTest(t)}
                className="bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-indigo-300"
              >
                {t} ✕
              </span>
            ))}
          </div>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b text-sm font-semibold text-gray-700">Sonuçlar</div>
          <div className="divide-y">
            {testResults.map((r, i) => (
              <div key={i} className={`flex justify-between items-center px-4 py-2.5 text-sm ${r.isAbnormal ? "bg-red-50" : ""}`}>
                <div>
                  <span className={`font-medium ${r.isAbnormal ? "text-red-700" : "text-gray-900"}`}>{r.testName}</span>
                  <span className="text-gray-500 text-xs ml-2">({r.referenceRange})</span>
                </div>
                <span className={`font-bold tabular-nums ${r.isAbnormal ? "text-red-600" : "text-green-700"}`}>
                  {r.result} {r.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {TEST_CATEGORIES.map(cat => (
        <div key={cat.label} className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <button
            onClick={() => setOpenCategory(openCategory === cat.label ? null : cat.label)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            <span>{cat.label}</span>
            {openCategory === cat.label ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {openCategory === cat.label && (
            <div className="border-t px-4 py-3 flex flex-wrap gap-2">
              {cat.tests.map(t => {
                const alreadyDone = testResults.some(r =>
                  r.testName.toLowerCase().includes(t.toLowerCase().split(" ")[0])
                );
                const selected = selectedTests.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => !alreadyDone && onToggleTest(t)}
                    disabled={alreadyDone}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${
                      alreadyDone
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
                        : selected
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                    }`}
                  >
                    {alreadyDone ? "✓ " : ""}{t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
