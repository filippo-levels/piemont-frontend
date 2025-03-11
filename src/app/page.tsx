"use client";
import { useState, useEffect } from "react";
import DocumentGrid from "@/components/DocumentGrid";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    analyzedDocuments: 0,
    totalCriteria: 0,
    averageCriteriaPerDoc: 0
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  // Funzione per caricare le statistiche
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Puoi sostituire questa chiamata con l'endpoint effettivo per le statistiche
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/list_files_disciplinari`);
        
        if (response.data && response.data.files) {
          // Calcola statistiche di base dai file disponibili
          const totalDocs = response.data.files.length;
          
          // Qui potresti fare altre chiamate API per ottenere statistiche più dettagliate
          // Per ora usiamo dati di esempio
          setStats({
            totalDocuments: totalDocs,
            analyzedDocuments: Math.floor(totalDocs * 0.8), // Esempio: 80% dei documenti analizzati
            totalCriteria: totalDocs * 5, // Esempio: media di 5 criteri per documento
            averageCriteriaPerDoc: 5 // Valore fisso per esempio
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

        {/* Dashboard Stats */}
        <div className="max-w-6xl mx-auto pt-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Disciplinari Totali</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.totalDocuments}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Disciplinari Analizzati</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.analyzedDocuments}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Criteri Totali</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.totalCriteria}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
              <div className="rounded-full bg-amber-100 p-3 mr-4">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Media Criteri/Doc</p>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.averageCriteriaPerDoc}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Document Grid con pulsante NUOVO */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">I tuoi disciplinari</h2>
              <div className="flex items-center gap-3">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  NUOVO
                </button>
              </div>
            </div>
            <DocumentGrid 
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
