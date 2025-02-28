"use client";
import FileUploader from "@/components/FileUploader";
import LogViewer from "@/components/LogViewer";
import JsonViewer from "@/components/JsonViewer";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { data } from "tailwindcss/defaultTheme";
import CriteriViewer from "@/components/CriteriViewer";
import FileList from "@/components/FileList";
import ConsegnaList from "@/components/ConsegnaList";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            Analizza un disciplinare di gara
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <FileUploader 
              setLogs={setLogs} 
              setJsonResult={setJsonResult} 
              setElapsedTime={setElapsedTime}
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <FileList 
              onError={(error) => setLogs(prev => [...prev, error])}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <ConsegnaList 
            onError={(error) => setLogs(prev => [...prev, error])}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <LogViewer logs={logs} elapsedTime={elapsedTime} />
        </div>

        {jsonResult && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <CriteriViewer criteri={[jsonResult]} data={jsonResult} />
          </div>
        )}
      </div>
    </div>
  );
}
