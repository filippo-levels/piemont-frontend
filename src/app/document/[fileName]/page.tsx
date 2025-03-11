"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CriteriaViewer from "@/components/CriteriaViewer";
import ConsegnaList from "@/components/ConsegnaList";

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const [criteriaData, setCriteriaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fileName = decodeURIComponent(params.fileName as string);
  const displayFileName = fileName.replace('.json', '');
  const searchFileName = displayFileName.replace('.pdf', '');

  const handleBack = () => {
    router.push('/');
  };

  const handleView = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/view_file/${fileName}`, '_blank');
  };

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get_criterias/${fileName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch criteria');
        }
        const data = await response.json();
        setCriteriaData(data);
      } catch (error) {
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
      <div className="max-w-6xl mx-auto p-6 space-y-6 pt-24">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{displayFileName}</h1>
            {!loading && !error && criteriaData && (
              <p className="text-sm text-gray-600 mt-2">
                Ultimo aggiornamento: {new Date(criteriaData.criterias.data_ora).toLocaleString('it-IT')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleView}
              className="px-4 py-2 bg-[#3dcab1] text-white rounded-lg hover:bg-[#3dcab1]/90 transition-colors flex items-center space-x-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Visualizza Documento</span>
            </button>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Torna alla Home
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center py-12">
                <svg className="animate-spin h-8 w-8 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-500">Caricamento criteri...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Criteri di Valutazione</h2>
                <CriteriaViewer data={criteriaData} />
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Lista Consegne</h2>
                <ConsegnaList initialSearchTerm={searchFileName} singleColumn={true} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 