"use client";
import FileUploader from "@/components/FileUploader";
import LogViewer from "@/components/LogViewer";
import JsonViewer from "@/components/JsonViewer";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [jsonResult, setJsonResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6 mb-6">
          <div className="w-1/2">
            <FileUploader setLogs={setLogs} setJsonResult={setJsonResult} />
          </div>
          <div className="w-1/2">
            <LogViewer logs={logs} />
          </div>
        </div>
        <div>
          <JsonViewer data={jsonResult} />
        </div>
      </div>
    </div>
  );
}
