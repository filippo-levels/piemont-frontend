import React, { useState } from 'react';

interface Props {
    logs: string[];
    elapsedTime: number;
  }
  
  export default function LogViewer({ logs, elapsedTime }: Props) {
    return (
      <div className="bg-gray-800 text-white p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl">Logs</h3>
          {elapsedTime > 0 && (
            <div className="text-sm text-gray-300">
              Tempo: {elapsedTime.toFixed(2)}s
            </div>
          )}
        </div>
        <div className="overflow-y-auto h-48">
          {logs.map((log, index) => (
            <div key={index} className="text-sm">
              {log}
            </div>
          ))}
        </div>
      </div>
    );
  }