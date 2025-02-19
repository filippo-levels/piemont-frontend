"use client";
import FileUploader from "@/components/FileUploader";
import LogViewer from "@/components/LogViewer";
import JsonViewer from "@/components/JsonViewer";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
            Analizzatore PDF
          </h1>
          <FileUploader 
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
            <JsonViewer data={jsonResult} />
          </div>
        )}
      </div>
    </div>
  );
}
