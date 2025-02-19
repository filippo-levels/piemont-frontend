import React from 'react';

interface Props {
    logs: string[];
    elapsedTime: number;
  }
  
  export default function LogViewer({ logs, elapsedTime }: Props) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Log di Sistema</h2>
          {elapsedTime > 0 && (
            <div className="px-3 py-1 bg-[#3dcab1]/10 text-[#3dcab1] rounded-md text-sm font-medium">
              Tempo: {elapsedTime.toFixed(2)}s
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 border rounded-xl p-4">
          <div className="overflow-y-auto max-h-[400px] space-y-2">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className="text-sm text-gray-600 py-2 px-3 bg-white rounded-lg shadow-sm border"
              >
                {log}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-8">
                Nessun log disponibile
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }