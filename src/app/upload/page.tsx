"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/components/FileUploader";
import CriteriViewer from "@/app/upload/CriteriViewer";

const STORAGE_KEY = 'uploadAnalysisResult';

export default function UploadPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const router = useRouter();
  const fileUploaderRef = useRef(null);

  // Carica i risultati dal localStorage all'avvio
  useEffect(() => {
    const savedResult = localStorage.getItem(STORAGE_KEY);
    if (savedResult) {
      try {
        setJsonResult(JSON.parse(savedResult));
      } catch (error) {
        console.error('Errore nel parsing dei dati salvati:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Salva i risultati nel localStorage quando cambiano
  useEffect(() => {
    if (jsonResult) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonResult));
    }
  }, [jsonResult]);

  const handleBack = () => {
    router.push('/');
  };

  const handleRemoveAnalysis = () => {
    localStorage.removeItem(STORAGE_KEY);
    setJsonResult(null);
    setLogs([]);
    setElapsedTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-6 space-y-6 pt-24">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-gray-800">
              Analizza un disciplinare di gara
            </h1>
            <div className="flex gap-3">
              {jsonResult && (
                <button
                  onClick={handleRemoveAnalysis}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Rimuovi analisi
                </button>
              )}
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Torna alla Home
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8 mx-auto">
            <FileUploader 
              ref={fileUploaderRef}
              setLogs={setLogs} 
              setJsonResult={setJsonResult} 
              setElapsedTime={setElapsedTime}
              onRemove={handleRemoveAnalysis}
            />
          </div>

          {/* Analysis Results */}
          {jsonResult && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <CriteriViewer 
                criteri={[jsonResult]}
                data={{
                  file_name: jsonResult.file_name || "Documento caricato",
                  data_ora: new Date().toISOString(),
                  metadata: jsonResult.metadata || {}
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 