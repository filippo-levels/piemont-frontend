"use client";
import FileUploader from "@/components/FileUploader";
import LogViewer from "@/components/LogViewer";
import JsonViewer from "@/components/JsonViewer";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import CriteriViewer from "@/components/CriteriViewer";
import FileList from "@/components/FileList";
import ConsegnaList from "@/components/ConsegnaList";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'gestionale'>('upload');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            Analizza un disciplinare di gara
          </h1>
          
          <Suspense fallback={<div>Loading tab navigation...</div>}>
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </Suspense>
        </div>

        {/* UPLOAD Section */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Carica un nuovo disciplinare</h2>
              <FileUploader 
                setLogs={setLogs} 
                setJsonResult={setJsonResult} 
                setElapsedTime={setElapsedTime}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Log di elaborazione</h2>
              <LogViewer logs={logs} elapsedTime={elapsedTime} />
            </div>

            {jsonResult && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Criteri identificati</h2>
                <CriteriViewer criteri={[jsonResult]} data={jsonResult} />
              </div>
            )}
          </div>
        )}

        {/* GESTIONALE Section */}
        {activeTab === 'gestionale' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Disciplinari caricati</h2>
              <Suspense fallback={<div>Loading...</div>}>
                <FileList 
                  onError={(error) => setLogs(prev => [...prev, error])}
                />
              </Suspense>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Consegne</h2>
              <ConsegnaList 
                onError={(error) => setLogs(prev => [...prev, error])}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// TabNavigation component that uses useSearchParams
function TabNavigation({ activeTab, setActiveTab }: { 
  activeTab: 'upload' | 'gestionale', 
  setActiveTab: (tab: 'upload' | 'gestionale') => void 
}) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'upload' || tab === 'gestionale') {
      setActiveTab(tab);
    }
  }, [searchParams, setActiveTab]);

  return (
    <div className="flex justify-center mt-6">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          className={`px-6 py-3 text-lg font-medium rounded-l-lg ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          UPLOAD
        </button>
        <button
          type="button"
          className={`px-6 py-3 text-lg font-medium rounded-r-lg ${
            activeTab === 'gestionale'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('gestionale')}
        >
          GESTIONALE
        </button>
      </div>
    </div>
  );
}
