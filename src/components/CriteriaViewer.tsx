"use client";

import { useState, useEffect } from 'react';

interface SubCriterio {
  id: string;
  nome: string;
  punteggioMassimo: string;
  descrizione: string;
  subCriteri: SubCriterio[];
}

interface Criterio extends SubCriterio {
  criteriSimili?: Array<{
    id: string;
    score: number;
    documents: string;
    criterio_id: string;
    filename: string;
  }>;
}

interface CriteriaData {
  file_name: string;
  criterias: {
    criteri: Criterio[];
    data_ora: string;
    file_name: string;
  };
}

interface CriteriaViewerProps {
  data: CriteriaData;
}

const CriterioCard = ({ 
  criterio, 
  level = 0,
  isAllExpanded
}: { 
  criterio: Criterio | SubCriterio; 
  level: number;
  isAllExpanded: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const paddingLeft = `${level * 1.5}rem`;

  // Update expansion state when isAllExpanded changes
  useEffect(() => {
    setIsExpanded(isAllExpanded);
  }, [isAllExpanded]);

  return (
    <div className="border rounded-lg mb-4 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div 
        className={`p-4 cursor-pointer ${level === 0 ? 'bg-gray-50' : ''}`}
        style={{ paddingLeft: `calc(1rem + ${paddingLeft})` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-blue-600">{criterio.id}</span>
              <h3 className="text-lg font-medium text-gray-900">{criterio.nome}</h3>
            </div>
            <div className="mt-1 text-sm text-blue-600 font-medium">
              {criterio.punteggioMassimo}
            </div>
          </div>
          <button 
            className={`p-2 hover:bg-gray-100 rounded-full transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4" style={{ paddingLeft: `calc(1rem + ${paddingLeft})` }}>
          <div className="mt-2 text-gray-600 text-sm whitespace-pre-wrap">
            {criterio.descrizione}
          </div>
          
          {criterio.subCriteri && criterio.subCriteri.length > 0 && (
            <div className="mt-4">
              {criterio.subCriteri.map((subCriterio) => (
                <CriterioCard 
                  key={subCriterio.id} 
                  criterio={subCriterio} 
                  level={level + 1}
                  isAllExpanded={isAllExpanded}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function CriteriaViewer({ data }: CriteriaViewerProps) {
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Solo il pulsante espandi/comprimi */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsAllExpanded(!isAllExpanded)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isAllExpanded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            )}
          </svg>
          {isAllExpanded ? 'Comprimi tutto' : 'Espandi tutto'}
        </button>
      </div>

      {/* Criteria list */}
      <div className="space-y-4">
        {data.criterias.criteri.map((criterio) => (
          <CriterioCard 
            key={criterio.id} 
            criterio={criterio} 
            level={0}
            isAllExpanded={isAllExpanded}
          />
        ))}
      </div>
    </div>
  );
} 