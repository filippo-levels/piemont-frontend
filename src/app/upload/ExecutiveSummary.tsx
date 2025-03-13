import React from 'react';

interface ExecutiveSummaryProps {
  data?: any;
}

export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  // If no data is provided, show a placeholder or loading state
  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Executive Summary</h2>
        <p className="text-gray-500 italic">Carica un documento e premi "ANALIZZA" per visualizzare il riepilogo esecutivo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Executive Summary</h2>
      <div className="space-y-4">
        {/* Stazione Appaltante */}
        <div className="flex items-start">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">1. Stazione appaltante / Cliente</h3>
            <p className="text-gray-600">{data.stazione_appaltante || data.stazioneAppaltante || "Non specificato"}</p>
          </div>
        </div>
        
        {/* Oggetto */}
        <div className="flex items-start">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">2. Oggetto / tipologia lavori</h3>
            <p className="text-gray-600">{data.oggetto || "Non specificato"}</p>
          </div>
        </div>
        
        {/* Importo */}
        <div className="flex items-start">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">3. Importo a base di gara</h3>
            <p className="text-gray-600">{data.importo || "Non specificato"}</p>
          </div>
        </div>
        
        {/* Scadenza */}
        <div className="flex items-start">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">4. Scadenze per la presentazione delle offerte</h3>
            <p className="text-gray-600">{data.scadenza || "Non specificato"}</p>
          </div>
        </div>
        
        {/* Identificativi */}
        <div className="flex items-start">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">5. Identificativi principali</h3>
            <p className="text-gray-600">
              CIG: {data.identificativi?.CIG || data.CIG || "Non specificato"}<br />
              CUP: {data.identificativi?.CUP || data.CUP || "Non specificato"}<br />
              CPV: {data.identificativi?.CPV || data.CPV || "Non specificato"}
            </p>
          </div>
        </div>
        
        {/* RUP */}
        <div className="flex items-start">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">6. Responsabile Unico del Procedimento (RUP)</h3>
            <p className="text-gray-600">{data.rup || "Non specificato"}</p>
          </div>
        </div>

        {/* Additional fields from API if available */}
        {data.procedura && (
          <div className="flex items-start">
            <div className="bg-pink-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">7. Procedura di gara</h3>
              <p className="text-gray-600">{data.procedura}</p>
            </div>
          </div>
        )}

        {/* Display any other fields that might be in the API response */}
        {Object.entries(data).map(([key, value]) => {
          // Skip fields we've already displayed
          if (['stazione_appaltante', 'stazioneAppaltante', 'oggetto', 'importo', 'scadenza', 
               'identificativi', 'CIG', 'CUP', 'CPV', 'rup', 'procedura'].includes(key)) {
            return null;
          }
          
          // Skip if value is an object or array (we'd need special handling for these)
          if (typeof value === 'object') return null;
          
          return (
            <div key={key} className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                <p className="text-gray-600">{String(value)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 