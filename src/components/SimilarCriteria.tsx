"use client";

import React from 'react';

interface SimilarCriterio {
  id: string;
  score: number;
  documents: string;
  criterio_id: string;
  filename: string;
}

interface Props {
  similarCriteria: SimilarCriterio[];
  onClose: () => void;
}

export default function SimilarCriteria({ similarCriteria, onClose }: Props) {
  const handleView = (fileName: string) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/view_file/${fileName}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="text-xl font-semibold mb-4">Criteri Simili</h3>
        
        <div className="space-y-4 overflow-y-auto">
          {similarCriteria.length > 0 ? (
            similarCriteria.map((criterio) => (
              <div 
                key={criterio.id}
                className="border rounded-lg p-4 hover:border-[#3dcab1] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">ID Criterio: {criterio.criterio_id}</h4>
                    <p className="text-sm text-gray-600">{criterio.documents}</p>
                  </div>
                  <div className="bg-[#3dcab1]/10 text-[#3dcab1] px-2 py-1 rounded text-sm">
                    Score: {(criterio.score * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    File: {criterio.filename}
                  </p>
                  <button
                    onClick={() => handleView(criterio.filename)}
                    className="text-xs px-2 py-1 bg-[#3dcab1] text-white rounded hover:bg-[#3dcab1]/90 transition-colors flex items-center space-x-1"
                    title="Visualizza questo file"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Visualizza File</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500">Nessun criterio simile disponibile per questo criterio.</p>
              <p className="text-sm text-gray-400 mt-2">I criteri simili verranno mostrati qui quando saranno disponibili.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 