"use client";
import { RefObject } from "react";
import { Send } from "lucide-react";
import { ChatMsg } from "./types";

interface ChatPanelProps {
  messages: ChatMsg[];
  patientName: string;
  chatInput: string;
  chatLoading: boolean;
  chatEndRef: RefObject<HTMLDivElement | null>;
  onInputChange: (v: string) => void;
  onSend: () => void;
}

export default function ChatPanel({
  messages, patientName, chatInput, chatLoading, chatEndRef, onInputChange, onSend,
}: ChatPanelProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "student" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === "student"
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-white text-gray-900 shadow-sm border rounded-bl-sm"
            }`}>
              {msg.role === "patient" && (
                <div className="text-xs font-semibold text-indigo-600 mb-1">{patientName}</div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm border text-sm text-gray-500 italic">
              Yanıt yazılıyor...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={chatInput}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && onSend()}
          placeholder="Hastaya soru sorun... (Enter ile gönder)"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={onSend}
          disabled={chatLoading || !chatInput.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
