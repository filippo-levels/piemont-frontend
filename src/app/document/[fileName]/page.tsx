"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import CriteriaViewer from "@/components/CriteriaViewer";
import ConsegnaList from "@/components/ConsegnaList";
import SimilarCriteria from "@/components/SimilarCriteria";
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
  const [similarCriteria, setSimilarCriteria] = useState<any[]>([]);
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
      
      // Make sure filename includes .pdf
      const fileNameWithPdf = displayFileName.endsWith('.pdf') ? displayFileName : `${displayFileName}.pdf`;
      
      console.log("Calling API with filename:", fileNameWithPdf);
      
      // Use GET with path parameter
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search_criteri/${encodeURIComponent(fileNameWithPdf)}`
      );
      
      console.log("Response data:", response.data);
      setSimilarCriteria(response.data.data || []);
      setShowSimilarCriteria(true);
    } catch (error) {
      console.error('Error fetching similar criteria:', error);
      alert('Errore durante il recupero dei criteri simili');
    } finally {
      setLoadingSimilarCriteria(false);
    }
  };

  const scrollToCriteria = () => {
    criteriaRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab('criteri');
  };

  const scrollToConsegne = () => {
    consegneRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab('consegne');
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
              onClick={handleCalculateSimilarCriteria}
              disabled={loadingSimilarCriteria || loading}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#3dcab1] text-white rounded-lg hover:bg-[#3dcab1]/90 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingSimilarCriteria ? (
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>Calcola Criteri Simili</span>
            </button>
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

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 sticky top-16 md:top-20 z-10">
          <div className="flex justify-center space-x-2 sm:space-x-4">
            <button
              onClick={scrollToConsegne}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                activeTab === 'consegne' 
                  ? 'bg-[#3dcab1] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Lista Consegne
              </div>
            </button>
            <button
              onClick={scrollToCriteria}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                activeTab === 'criteri' 
                  ? 'bg-[#3dcab1] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Criteri di Valutazione
              </div>
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
                <ConsegnaList initialSearchTerm={searchFileName} singleColumn={true} />
              </div>
              
              {/* Criteri di Valutazione Section (Second) */}
              <div ref={criteriaRef} className="bg-white rounded-xl shadow-lg p-4 sm:p-8 scroll-mt-24 sm:scroll-mt-32">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#3dcab1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Criteri di Valutazione
                </h2>
                <CriteriaViewer data={criteriaData} />
              </div>
            </>
          )}
        </div>
        
        {/* Floating Navigation Button - only visible on mobile and small screens */}
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex flex-col space-y-3 z-20">
          <button 
            onClick={scrollToConsegne}
            className="p-2 sm:p-3 bg-[#3dcab1] text-white rounded-full shadow-lg hover:bg-[#35b6a0] transition-colors"
            title="Vai alle consegne"
            aria-label="Vai alle consegne"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
          <button 
            onClick={scrollToCriteria}
            className="p-2 sm:p-3 bg-[#3dcab1] text-white rounded-full shadow-lg hover:bg-[#35b6a0] transition-colors"
            title="Vai ai criteri"
            aria-label="Vai ai criteri"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Similar Criteria Modal */}
      {showSimilarCriteria && (
        <SimilarCriteria 
          similarCriteria={similarCriteria} 
          onClose={() => setShowSimilarCriteria(false)} 
        />
      )}
    </div>
  );
} 