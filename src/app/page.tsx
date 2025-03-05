"use client";
import FileUploader from "@/components/FileUploader";
import LogViewer from "@/components/LogViewer";
import JsonViewer from "@/components/JsonViewer";
import { useState, useEffect, Suspense, useRef } from "react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileUploaderRef = useRef(null);
  
  // Funzione per impostare il file selezionato
  const handleSetFile = (file: File) => {
    setSelectedFile(file);
    // Cambia tab per tornare alla sezione di upload
    setActiveTab('upload');
  };
  
  // Effetto per aggiornare il FileUploader quando viene selezionato un file
  useEffect(() => {
    if (selectedFile && fileUploaderRef.current) {
      // @ts-ignore - Accesso al metodo esposto
      fileUploaderRef.current.setFileFromExternal(selectedFile);
    }
  }, [selectedFile]);
  
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
              <FileUploader 
                ref={fileUploaderRef}
                setLogs={setLogs} 
                setJsonResult={setJsonResult} 
                setElapsedTime={setElapsedTime}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
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
                  setFile={handleSetFile}
                  setLogs={setLogs}
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

  // Removed the tab buttons, but keeping the component for URL parameter handling
  return null;
}
