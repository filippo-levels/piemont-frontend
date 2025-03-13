"use client";
import { useState, useEffect, useRef } from "react";
import DocumentGrid from "@/components/DocumentGrid";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalDocuments: 0
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const documentGridRef = useRef<{ fetchDocuments: () => Promise<void> } | null>(null);
  const router = useRouter();

  // Funzione per caricare le statistiche
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Puoi sostituire questa chiamata con l'endpoint effettivo per le statistiche
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/list_files_disciplinari`);
      
      if (response.data && response.data.files) {
        // Calcola statistiche di base dai file disponibili
        const totalDocs = response.data.files.length;
        
        setStats({
          totalDocuments: totalDocs
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per aggiornare sia le statistiche che la lista dei documenti
  const handleRefresh = async () => {
    await fetchStats();
    if (documentGridRef.current) {
      await documentGridRef.current.fetchDocuments();
    }
  };

  // Funzione per gestire il click su un documento
  const handleDocumentClick = (fileName: string) => {
    // Naviga alla pagina del documento con il nome del file come parametro
    router.push(`/document/${encodeURIComponent(fileName)}`);
  };

  // Funzione per gestire il click sul pulsante "NUOVO"
  const handleNewDocument = () => {
    router.push('/upload');
  };

  // Funzione per cambiare la modalità di visualizzazione
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* Header Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Piattaforma di Gestione Disciplinari
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analizza e gestisci i tuoi disciplinari di gara.
          </p>
        </div>

        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Document Grid con pulsante NUOVO */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">I tuoi disciplinari</h2>
                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-medium">
                  {loading ? '...' : stats.totalDocuments} totali
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  title="Aggiorna la lista dei disciplinari"
                  disabled={loading}
                >
                  <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden sm:inline">{loading ? 'Caricamento...' : 'Aggiorna'}</span>
                </button>
                <button
                  onClick={toggleViewMode}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  title={viewMode === 'grid' ? 'Passa alla visualizzazione a elenco' : 'Passa alla visualizzazione a griglia'}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      <span className="hidden sm:inline">Elenco</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      <span className="hidden sm:inline">Griglia</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleNewDocument}
                  className="px-5 py-2.5 bg-[#3dcab1] text-white rounded-lg hover:bg-[#3dcab1]/90 transition-colors flex items-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  UPLOAD
                </button>
              </div>
            </div>
            <DocumentGrid 
              ref={documentGridRef}
              onError={(error) => setLogs(prev => [...prev, error])}
              onDocumentClick={handleDocumentClick}
              showNewButton={false}
              hideTitle={true}
              smallerIcons={true}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
