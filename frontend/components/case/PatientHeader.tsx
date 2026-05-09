"use client";
import { ArrowLeft } from "lucide-react";
import { Patient } from "./types";

interface VitalBadgeProps {
  label: string;
  value: string;
  unit: string;
  warn: boolean;
}

function VitalBadge({ label, value, unit, warn }: VitalBadgeProps) {
  return (
    <div className={`px-2 py-1 rounded-lg ${warn ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
      <div className="font-bold">{value}<span className="font-normal opacity-75">{unit}</span></div>
      <div className="opacity-75">{label}</div>
    </div>
  );
}

interface PatientHeaderProps {
  patient: Patient;
  onBack: () => void;
}

export default function PatientHeader({ patient, onBack }: PatientHeaderProps) {
  const { heartRate, oxygenSaturation, temperature } = patient.vitals;
  return (
    <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center gap-3">
      <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex-1">
        <div className="font-bold text-gray-900">{patient.name}</div>
        <div className="text-xs text-gray-600">{patient.age} yaş • {patient.gender}</div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <VitalBadge label="Nabız" value={`${heartRate}`} unit="/dk" warn={heartRate < 60 || heartRate > 100} />
        <VitalBadge label="SpO2" value={`${oxygenSaturation}`} unit="%" warn={oxygenSaturation < 95} />
        <VitalBadge label="Ateş" value={`${temperature}`} unit="°C" warn={temperature >= 37.5} />
      </div>
    </div>
  );
}
