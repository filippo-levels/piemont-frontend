"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ConsegneFolderProps {
  fileName: string;
}

export default function ConsegneFolder({ fileName }: ConsegneFolderProps) {
  const [consegne, setConsegne] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsegne = async () => {
      try {
        setLoading(true);
        // Sostituisci con l'endpoint effettivo per le consegne
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/consegne/${fileName}`);
        
        if (response.data && response.data.consegne) {
          setConsegne(response.data.consegne);
        } else {
          setConsegne([]);
        }
      } catch (error) {
        console.error('Error fetching consegne:', error);
        setError('Impossibile caricare le consegne');
      } finally {
        setLoading(false);
      }
    };

    if (fileName) {
      fetchConsegne();
    }
  }, [fileName]);

  const handleOpenConsegna = (consegnaId: string) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/view_consegna/${consegnaId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3dcab1]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p>{error}</p>
      </div>
    );
  }

  if (consegne.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p>Nessuna consegna disponibile per questo disciplinare</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {consegne.map((consegna, index) => (
        <div 
          key={index}
          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => handleOpenConsegna(consegna.id)}
        >
          <div className="bg-amber-100 p-2 rounded-lg mr-3">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{consegna.nome || `Consegna ${index + 1}`}</h3>
            <p className="text-sm text-gray-500">{consegna.data || 'Data non disponibile'}</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      ))}
    </div>
  );
} 