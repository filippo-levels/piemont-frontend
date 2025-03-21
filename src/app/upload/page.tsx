"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/app/upload/FileUploader";
import CriteriSimiliViewer from "@/app/upload/CriteriSimiliViewer";
import ExecutiveSummary from "@/app/upload/ExecutiveSummary";
import { clearAllJsonDebugData } from "./components/JsonDebugViewer";

const STORAGE_KEY = 'uploadAnalysisResult';
const EXECUTIVE_SUMMARY_KEY = 'executiveSummaryResult';

export default function UploadPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [executiveSummary, setExecutiveSummary] = useState<any>(null);
  const [activeView, setActiveView] = useState<'criteri' | 'executive' | null>(null);
  const router = useRouter();
  const fileUploaderRef = useRef(null);

  // Carica i risultati dal localStorage all'avvio
  useEffect(() => {
    // Carica i criteri estratti
    const savedResult = localStorage.getItem(STORAGE_KEY);
    if (savedResult) {
      try {
        setJsonResult(JSON.parse(savedResult));
        setActiveView('criteri');
      } catch (error) {
        console.error('Errore nel parsing dei dati salvati:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    // Carica l'executive summary
    const savedSummary = localStorage.getItem(EXECUTIVE_SUMMARY_KEY);
    if (savedSummary) {
      try {
        setExecutiveSummary(JSON.parse(savedSummary));
        // Se non ci sono criteri estratti, mostra l'executive summary
        if (!savedResult) {
          setActiveView('executive');
        }
      } catch (error) {
        console.error('Errore nel parsing dell\'executive summary salvato:', error);
        localStorage.removeItem(EXECUTIVE_SUMMARY_KEY);
      }
    }
  }, []);

  // Salva i risultati nel localStorage quando cambiano
  useEffect(() => {
    if (jsonResult) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonResult));
      setActiveView('criteri');
    }
  }, [jsonResult]);

  // Salva l'executive summary nel localStorage quando cambia
  useEffect(() => {
    if (executiveSummary) {
      localStorage.setItem(EXECUTIVE_SUMMARY_KEY, JSON.stringify(executiveSummary));
      setActiveView('executive');
    }
  }, [executiveSummary]);

  const handleBack = () => {
    router.push('/');
  };

  const handleRemoveAnalysis = () => {
    // Rimuovi tutti i dati dal localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXECUTIVE_SUMMARY_KEY);
    clearAllJsonDebugData();
    
    // Resetta lo stato
    setJsonResult(null);
    setExecutiveSummary(null);
    setLogs([]);
    setElapsedTime(0);
    setActiveView(null);
    
    // Ricarica la pagina per assicurarsi che tutto sia correttamente resettato
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pt-16 sm:pt-24">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Analizza un disciplinare di gara
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {(jsonResult || executiveSummary) && (
                <button
                  onClick={handleRemoveAnalysis}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 sm:gap-2"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="whitespace-nowrap">Rimuovi analisi</span>
                </button>
              )}
              <button
                onClick={handleBack}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1 sm:gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="whitespace-nowrap">Torna alla Home</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mx-auto">
            <FileUploader 
              ref={fileUploaderRef}
              setLogs={setLogs} 
              setJsonResult={setJsonResult} 
              setElapsedTime={setElapsedTime}
              setExecutiveSummary={setExecutiveSummary}
              onRemove={handleRemoveAnalysis}
            />
          </div>

          {/* View Selector Tabs (only show if we have results) */}
          {(jsonResult || executiveSummary) && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-2 mb-4">
              <div className="flex flex-wrap">
                {jsonResult && (
                  <button
                    onClick={() => setActiveView('criteri')}
                    className={`py-1.5 sm:py-2 px-3 sm:px-4 text-sm font-medium ${
                      activeView === 'criteri'
                        ? 'border-b-2 border-[#3dcab1] text-[#3dcab1]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Criteri Estratti
                  </button>
                )}
                {executiveSummary && (
                  <button
                    onClick={() => setActiveView('executive')}
                    className={`py-1.5 sm:py-2 px-3 sm:px-4 text-sm font-medium ${
                      activeView === 'executive'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Executive Summary
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Conditional Rendering of Results */}
          {activeView === 'criteri' && jsonResult && (
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
              <CriteriSimiliViewer 
                criteri={jsonResult.criteri || []}
                data={{
                  file_name: jsonResult.file_name || "Documento caricato",
                  data_ora: new Date().toISOString(),
                  metadata: jsonResult.metadata || {}
                }}
              />
            </div>
          )}

          {activeView === 'executive' && executiveSummary && (
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
              <ExecutiveSummary data={executiveSummary} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 