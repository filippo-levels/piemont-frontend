"use client";
import { useState } from "react";
import ChatHistory from "@/app/lucy/ChatHistory";

export default function LucyPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-6 space-y-6 pt-24">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center">
            <div className="bg-[#3dcab1] rounded-full p-3 mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Lucy - Assistente Virtuale
              </h1>
              <p className="text-gray-600 mt-1">
                Consulta lo storico delle tue conversazioni con Lucy, l'assistente virtuale per i disciplinari di gara.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <ChatHistory />
        </div>
      </div>
    </div>
  );
} 