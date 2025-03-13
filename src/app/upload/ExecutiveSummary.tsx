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
            <p className="text-gray-600">{data.oggetto_lavori || data.oggetto || "Non specificato"}</p>
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
            <p className="text-gray-600">{data.importo_base_asta || data.importo || "Non specificato"}</p>
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
            <h3 className="text-lg font-medium text-gray-800">4. Scadenze</h3>
            <p className="text-gray-600">
              Offerta: {data.scadenza_offerta || data.scadenza || "Non specificato"}<br />
              {data.scadenza_chiarimenti && `Chiarimenti: ${data.scadenza_chiarimenti}`}
            </p>
          </div>
        </div>
        
        {/* Lotti */}
        {data.numero_importo_lotti && data.numero_importo_lotti.length > 0 && (
          <div className="flex items-start">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">5. Lotti</h3>
              <div className="space-y-2 mt-2">
                {data.numero_importo_lotti.map((lotto: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">
                      <span className="font-medium">CIG:</span> {lotto.CIG || "Non specificato"}<br />
                      <span className="font-medium">Importo:</span> {lotto.importo || "Non specificato"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Punteggi */}
        {(data.punteggio_economico !== undefined || data.punteggio_tecnico !== undefined) && (
          <div className="flex items-start">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">6. Punteggi</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {data.punteggio_economico !== undefined && (
                  <div className="bg-blue-50 px-4 py-3 rounded-lg">
                    <p className="text-blue-800 font-medium text-center">Economico</p>
                    <p className="text-2xl font-bold text-blue-600 text-center">{data.punteggio_economico}</p>
                    <p className="text-xs text-blue-500 text-center">punti</p>
                  </div>
                )}
                {data.punteggio_tecnico !== undefined && (
                  <div className="bg-green-50 px-4 py-3 rounded-lg">
                    <p className="text-green-800 font-medium text-center">Tecnico</p>
                    <p className="text-2xl font-bold text-green-600 text-center">{data.punteggio_tecnico}</p>
                    <p className="text-xs text-green-500 text-center">punti</p>
                  </div>
                )}
                {data.punteggio_economico !== undefined && data.punteggio_tecnico !== undefined && (
                  <div className="bg-purple-50 px-4 py-3 rounded-lg">
                    <p className="text-purple-800 font-medium text-center">Totale</p>
                    <p className="text-2xl font-bold text-purple-600 text-center">{data.punteggio_economico + data.punteggio_tecnico}</p>
                    <p className="text-xs text-purple-500 text-center">punti</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Formula Economica */}
        {data.formula_economica && (
          <div className="flex items-start">
            <div className="bg-pink-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">7. Formula Economica</h3>
              <p className="text-gray-600 font-mono text-sm bg-gray-50 p-2 rounded mt-1">{data.formula_economica}</p>
            </div>
          </div>
        )}

        {/* Criteri */}
        {(data.criteri_discrezionali || data.criteri_quantitativi || data.criteri_tabellari) && (
          <div className="flex items-start">
            <div className="bg-teal-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">8. Criteri di valutazione</h3>
              
              {data.criteri_discrezionali && data.criteri_discrezionali.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium text-gray-700">Discrezionali:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.criteri_discrezionali.map((criterio: string, index: number) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">{criterio}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.criteri_quantitativi && data.criteri_quantitativi.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium text-gray-700">Quantitativi:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.criteri_quantitativi.map((criterio: string, index: number) => (
                      <span key={index} className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm">{criterio}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.criteri_tabellari && data.criteri_tabellari.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium text-gray-700">Tabellari:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.criteri_tabellari.map((criterio: string, index: number) => (
                      <span key={index} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-sm">{criterio}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informazioni Aggiuntive */}
        <div className="flex items-start">
          <div className="bg-gray-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">9. Informazioni Aggiuntive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {data.tipologia && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">Tipologia:</span> {data.tipologia}
                </div>
              )}
              {data.anno && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">Anno:</span> {data.anno}
                </div>
              )}
              {data.sopralluogo_obbligatorio && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">Sopralluogo obbligatorio:</span> {data.sopralluogo_obbligatorio}
                </div>
              )}
              {data.riparametrizzazione_punteggi && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">Riparametrizzazione punteggi:</span> {data.riparametrizzazione_punteggi}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Display any other fields that might be in the API response */}
        {Object.entries(data).map(([key, value]) => {
          // Skip fields we've already displayed
          const displayedFields = [
            'stazione_appaltante', 'stazioneAppaltante', 'oggetto', 'oggetto_lavori', 
            'importo', 'importo_base_asta', 'scadenza', 'scadenza_offerta', 'scadenza_chiarimenti',
            'identificativi', 'CIG', 'CUP', 'CPV', 'rup', 'procedura', 'numero_importo_lotti',
            'punteggio_economico', 'punteggio_tecnico', 'formula_economica', 'criteri_discrezionali',
            'criteri_quantitativi', 'criteri_tabellari', 'tipologia', 'anno', 'sopralluogo_obbligatorio',
            'riparametrizzazione_punteggi', 'file_name', 'data_ora'
          ];
          
          if (displayedFields.includes(key)) {
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