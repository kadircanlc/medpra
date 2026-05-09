"use client";
import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { MessageCircle, FlaskConical, Stethoscope, Send, Timer } from "lucide-react";
import { Patient, ChatMsg, TestResult, ExamResult, Evaluation, DiseaseSummary } from "@/components/case/types";
import PatientHeader from "@/components/case/PatientHeader";
import ChatPanel from "@/components/case/ChatPanel";
import TestPanel from "@/components/case/TestPanel";
import ExamPanel from "@/components/case/ExamPanel";
import DiagnosisPanel from "@/components/case/DiagnosisPanel";
import EvaluationView from "@/components/case/EvaluationView";

type Tab = "chat" | "tests" | "exam" | "diagnosis";

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

function CaseContent() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session");

  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loadingTests, setLoadingTests] = useState(false);

  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loadingExam, setLoadingExam] = useState(false);

  const [differentials, setDifferentials] = useState<string[]>(["", "", ""]);
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const [summary, setSummary] = useState<DiseaseSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  const [timerOn, setTimerOn] = useState(true);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!timerOn || evaluation) return;
    const id = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [timerOn, evaluation]);

  useEffect(() => {
    const stored = sessionStorage.getItem(`patient_${sessionId}`);
    if (stored) {
      const p = JSON.parse(stored) as Patient;
      setPatient(p);
      setMessages([{ role: "patient", content: "Merhaba doktor. " + p.chiefComplaint }]);
    } else {
      router.push("/dashboard");
    }
  }, [sessionId, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setMessages(prev => [...prev, { role: "student", content: msg }]);
    setChatLoading(true);
    try {
      const { data } = await api.post("/api/case/chat", { sessionId, message: msg });
      setMessages(prev => [...prev, { role: "patient", content: data.reply }]);
    } catch {
      toast.error("Yanıt alınamadı.");
    } finally {
      setChatLoading(false);
    }
  };

  const toggleTest = (t: string) =>
    setSelectedTests(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const requestTests = async () => {
    if (!selectedTests.length) return;
    setLoadingTests(true);
    try {
      const { data } = await api.post("/api/case/request-tests", { sessionId, tests: selectedTests });
      setTestResults(data.results);
      setSelectedTests([]);
      setActiveTab("tests");
    } catch {
      toast.error("Tetkik sonuçları alınamadı.");
    } finally {
      setLoadingTests(false);
    }
  };

  const requestPhysicalExam = async (examType: string) => {
    if (loadingExam || examResults.some(r => r.examType === examType)) return;
    setLoadingExam(true);
    try {
      const { data } = await api.post("/api/case/physical-exam", { sessionId, examType });
      setExamResults(prev => [...prev, data]);
    } catch {
      toast.error("Muayene sonucu alınamadı.");
    } finally {
      setLoadingExam(false);
    }
  };

  const submitDiagnosis = async () => {
    if (!diagnosis.trim() || !treatment.trim()) {
      toast.error("Tanı ve tedavi alanlarını doldurun.");
      return;
    }
    setSubmitting(true);
    const filledDiffs = differentials.filter(d => d.trim());
    try {
      const { data } = await api.post("/api/case/submit-diagnosis", {
        sessionId,
        diagnosis,
        treatment,
        differentialDiagnoses: filledDiffs,
        timeTakenSeconds: elapsedRef.current,
      });
      setEvaluation(data);
    } catch {
      toast.error("Tanı gönderilemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadDiseaseSummary = async () => {
    setLoadingSummary(true);
    try {
      const { data } = await api.get(`/api/case/summary/${sessionId}`);
      setSummary(data);
    } catch {
      toast.error("Hastalık özeti yüklenemedi.");
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (evaluation) {
    return (
      <EvaluationView
        evaluation={evaluation}
        timeTakenSeconds={elapsedRef.current}
        summary={summary}
        loadingSummary={loadingSummary}
        onLoadSummary={loadDiseaseSummary}
        onNewCase={() => router.push("/dashboard")}
      />
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "chat", label: "Hasta Görüşmesi", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "tests", label: "Tetkikler", icon: <FlaskConical className="w-4 h-4" /> },
    { id: "exam", label: "Fizik Muayene", icon: <Stethoscope className="w-4 h-4" /> },
    { id: "diagnosis", label: "Tanı & Tedavi", icon: <Send className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PatientHeader patient={patient} onBack={() => router.push("/dashboard")} />

      {/* Timer bar */}
      <div className="flex items-center justify-end gap-2 px-4 pt-2">
        <button
          onClick={() => setTimerOn(p => !p)}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition ${
            timerOn ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-gray-100 border-gray-200 text-gray-500"
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          {formatTime(elapsed)}
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 mx-4 mt-2 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id ? "bg-white shadow text-indigo-600" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden px-4 pb-4 mt-3">
        {activeTab === "chat" && (
          <ChatPanel
            messages={messages}
            patientName={patient.name}
            chatInput={chatInput}
            chatLoading={chatLoading}
            chatEndRef={chatEndRef}
            onInputChange={setChatInput}
            onSend={sendMessage}
          />
        )}
        {activeTab === "tests" && (
          <TestPanel
            selectedTests={selectedTests}
            testResults={testResults}
            loadingTests={loadingTests}
            onToggleTest={toggleTest}
            onRequestTests={requestTests}
          />
        )}
        {activeTab === "exam" && (
          <ExamPanel
            examResults={examResults}
            loadingExam={loadingExam}
            onExamRequest={requestPhysicalExam}
          />
        )}
        {activeTab === "diagnosis" && (
          <DiagnosisPanel
            testResults={testResults}
            diagnosis={diagnosis}
            treatment={treatment}
            differentials={differentials}
            submitting={submitting}
            onDiagnosisChange={setDiagnosis}
            onTreatmentChange={setTreatment}
            onDifferentialsChange={setDifferentials}
            onSubmit={submitDiagnosis}
            onGoToTests={() => setActiveTab("tests")}
          />
        )}
      </div>
    </div>
  );
}

export default function CasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    }>
      <CaseContent />
    </Suspense>
  );
}
