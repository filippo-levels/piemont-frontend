"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CriteriSimiliViewer from "@/app/upload/CriteriSimiliViewer";
import axios from "axios";

export default function CriteriaPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [criteriaData, setCriteriaData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileName = decodeURIComponent(params.fileName as string);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get_criterias/${fileName}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY
          }
        });
        
        if (response.data) {
          setCriteriaData(response.data);
        } else {
          setError('Nessun criterio trovato');
        }
      } catch (err) {
        setError('Errore nel caricamento dei criteri');
        console.error('Error fetching criteria:', err);
      } finally {
        setLoading(false);
      }
    };

    if (fileName) {
      fetchCriteria();
    }
  }, [fileName]);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-6 space-y-6 pt-24">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-gray-800">
              Criteri del documento
            </h1>
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
          <p className="text-gray-600 mt-2 text-lg">{fileName}</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 flex justify-center items-center">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-8 w-8 text-[#3dcab1]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium text-gray-700">Caricamento criteri...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center text-red-500">
              <svg className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xl font-medium">{error}</p>
              <button
                onClick={handleBack}
                className="mt-4 px-4 py-2 bg-[#3dcab1] text-white rounded-lg hover:bg-[#3dcab1]/90 transition-colors"
              >
                Torna alla Home
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <CriteriSimiliViewer 
              criteri={criteriaData.criteri || []} 
              data={criteriaData} 
            />
          </div>
        )}
      </div>
    </div>
  );
} 