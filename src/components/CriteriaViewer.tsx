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
  const paddingLeft = `${level * 1}rem`;

  // Update expansion state when isAllExpanded changes
  useEffect(() => {
    setIsExpanded(isAllExpanded);
  }, [isAllExpanded]);

  const hasSubCriteri = criterio.subCriteri && criterio.subCriteri.length > 0;
  
  return (
    <div className="mb-2">
      <div 
        className={`border rounded-lg transition-all duration-200 overflow-hidden ${
          isExpanded ? 'shadow-md' : 'shadow-sm'
        } ${level === 0 ? 'border-gray-300' : 'border-gray-200'}`}
      >
        <div 
          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 gap-2 sm:gap-4 ${
            level === 0 
              ? 'bg-gray-50' 
              : level === 1 
                ? 'bg-gray-50/50' 
                : 'bg-white'
          }`}
          style={{ paddingLeft: `calc(${paddingLeft} + 0.75rem)` }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              {hasSubCriteri && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 mt-0.5 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm sm:text-base ${level === 0 ? 'text-gray-800' : 'text-gray-700'} truncate`}>
                  {criterio.nome}
                </h3>
                {criterio.descrizione && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                    {criterio.descrizione}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 mt-1 sm:mt-0">
            {criterio.punteggioMassimo && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs sm:text-sm text-blue-700 whitespace-nowrap">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Punti: {criterio.punteggioMassimo}</span>
              </div>
            )}
            
            {'criteriSimili' in criterio && criterio.criteriSimili && criterio.criteriSimili.length > 0 && (
              <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded text-xs sm:text-sm text-purple-700 whitespace-nowrap">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>{criterio.criteriSimili.length} simili</span>
              </div>
            )}
          </div>
        </div>
        
        {isExpanded && hasSubCriteri && (
          <div className="border-t border-gray-200 p-2 sm:p-3">
            <div className="space-y-2">
              {criterio.subCriteri.map((subCriterio) => (
                <CriterioCard 
                  key={subCriterio.id} 
                  criterio={subCriterio} 
                  level={level + 1}
                  isAllExpanded={isAllExpanded}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function CriteriaViewer({ data }: CriteriaViewerProps) {
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  
  if (!data || !data.criterias || !data.criterias.criteri) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nessun criterio disponibile
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setIsAllExpanded(!isAllExpanded)}
          className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isAllExpanded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
            )}
          </svg>
          <span>{isAllExpanded ? 'Comprimi tutti' : 'Espandi tutti'}</span>
        </button>
      </div>
      
      <div className="space-y-3">
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