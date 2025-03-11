"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/components/FileUploader";
import CriteriViewer from "@/app/upload/CriteriViewer";

export default function UploadPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const router = useRouter();
  const fileUploaderRef = useRef(null);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-6 space-y-6 pt-24">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-gray-800">
              Analizza un disciplinare di gara
            </h1>
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

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8 mx-auto">
            <FileUploader 
              ref={fileUploaderRef}
              setLogs={setLogs} 
              setJsonResult={setJsonResult} 
              setElapsedTime={setElapsedTime}
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