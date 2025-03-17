"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import CriteriaViewer from "@/components/CriteriaViewer";
import CriteriViewer from "@/app/upload/CriteriViewer";
import ConsegnaList from "@/components/ConsegnaList";
import axios from "axios";

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const [criteriaData, setCriteriaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'consegne' | 'criteri'>('consegne');
  const criteriaRef = useRef<HTMLDivElement>(null);
  const consegneRef = useRef<HTMLDivElement>(null);
  const [similarCriteria, setSimilarCriteria] = useState<any>(null);
  const [showSimilarCriteria, setShowSimilarCriteria] = useState(false);
  const [loadingSimilarCriteria, setLoadingSimilarCriteria] = useState(false);
  
  const fileName = decodeURIComponent(params.fileName as string);
  const displayFileName = fileName.replace('.json', '');
  const searchFileName = displayFileName.replace('.pdf', '');

  const handleBack = () => {
    router.push('/');
  };

  const handleView = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/view_file/${fileName}`, '_blank');
  };

  const handleCalculateSimilarCriteria = async () => {
    try {
      setLoadingSimilarCriteria(true);
      
      const fileNameWithPdf = displayFileName.endsWith('.pdf') ? displayFileName : `${displayFileName}.pdf`;
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search_criteri/${encodeURIComponent(fileNameWithPdf)}`
      );
      
      // Format the data for CriteriViewer - filter out the root element
      const formattedData = {
        // Only include the subCriteri from the root element, not the root itself
        criteri: response.data.data.subCriteri || [],
        data: response.data
      };
      
      setSimilarCriteria(formattedData);
      setShowSimilarCriteria(true);
      // Automatically switch to criteri tab to show the results
      scrollToCriteria();
    } catch (error) {
      alert('Errore durante il recupero dei criteri simili');
    } finally {
      setLoadingSimilarCriteria(false);
    }
  };

  const scrollToCriteria = () => {
    criteriaRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab('criteri');
  };


  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get_criterias/${fileName}`);
        setCriteriaData(response.data);
      } catch (error: any) {
        console.error('Error fetching criteria:', error);
        setError('Errore durante il recupero dei criteri. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchCriteria();
  }, [fileName]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6 pt-16 md:pt-24">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-words">{displayFileName}</h1>
            {!loading && !error && criteriaData && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                Ultimo aggiornamento: {new Date(criteriaData.criterias.data_ora).toLocaleString('it-IT')}
              </p>
            )}
          </div>
          <div className="flex flex-wrap w-full sm:w-auto items-center gap-2 sm:gap-3">
            <button
              onClick={handleView}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#3dcab1] text-white rounded-lg hover:bg-[#3dcab1]/90 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Visualizza</span>
            </button>
            <button
              onClick={handleBack}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="sm:inline">Torna alla Home</span>
            </button>
          </div>
        </div>

        

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-4 sm:gap-8">
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
              <div className="text-center py-8 sm:py-12">
                <svg className="animate-spin h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-500">Caricamento criteri...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
              <div className="text-center py-8 sm:py-12">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-500 text-sm sm:text-base">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Lista Consegne Section (First) */}
              <div ref={consegneRef} className="bg-white rounded-xl shadow-lg p-4 sm:p-8 scroll-mt-24 sm:scroll-mt-32">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#3dcab1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Lista Consegne
                </h2>
                <ConsegnaList key={`consegna-list-${searchFileName}`} initialSearchTerm={searchFileName} singleColumn={true} />
              </div>
              
              {/* Criteri di Valutazione Section (Second) */}
              <div ref={criteriaRef} className="bg-white rounded-xl shadow-lg p-4 sm:p-8 scroll-mt-24 sm:scroll-mt-32">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#3dcab1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Criteri di Valutazione
                  </h2>
                  
                  {!showSimilarCriteria && (
                    <button
                      onClick={handleCalculateSimilarCriteria}
                      disabled={loadingSimilarCriteria || loading}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#3dcab1] text-white rounded-lg hover:bg-[#3dcab1]/90 transition-colors flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingSimilarCriteria ? (
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span>Calcola Criteri Simili</span>
                    </button>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  {loadingSimilarCriteria ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <svg className="animate-spin h-16 w-16 text-[#3dcab1] mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-gray-600 font-medium">Calcolo criteri simili in corso...</p>
                    </div>
                  ) : showSimilarCriteria && similarCriteria ? (
                    <CriteriViewer criteri={similarCriteria.criteri} data={similarCriteria.data} />
                  ) : (
                    <CriteriaViewer data={criteriaData} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        
      </div>
    </div>
  );
} 