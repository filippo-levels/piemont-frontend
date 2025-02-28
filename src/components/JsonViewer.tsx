"use client";

import React from "react";
import CriteriViewer from "./CriteriViewer";

interface Props {
  data: any;
}

export default function JsonViewer({ data }: Props) {
  if (!data) return null;

  return (
    <div className="space-y-8">
      
      
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl mb-2">Visualizzazione JSON</h3>
        <pre className="whitespace-pre-wrap overflow-auto max-h-[800px]">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
