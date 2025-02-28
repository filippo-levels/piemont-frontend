"use client";

import React, { useState } from "react";
import JsonViewer from "./JsonViewer";
import SimilarCriteria from "./SimilarCriteria";

interface Criterio {
  id: string;
  nome: string;
  punteggioMassimo: string;
  descrizione: string;
  criteriSimili: Array<{
    id: string;
    score: number;
    documents: string;
    criterio_id: string;
    filename: string;
  }>;
  subCriteri: Criterio[];
}

interface Props {
  criteri: Criterio[];
  data: any;
}

const CriterioCard: React.FC<{ criterio: Criterio; level?: number }> = ({
  criterio,
  level = 0,
}) => {
  const [showSimilar, setShowSimilar] = useState(false);
  const hasSimilarCriteria = criterio.criteriSimili?.length > 0;

  return (
    <div
      className={`border rounded-lg p-4 mb-4 ${
        level === 0 ? "bg-white" : "bg-gray-50"
      }`}
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">
          {criterio.id} - {criterio.nome}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-medium">{criterio.punteggioMassimo}</span>
          {hasSimilarCriteria && (
            <button
              onClick={() => setShowSimilar(true)}
              className="flex items-center gap-1 px-2 py-1 bg-[#3dcab1] text-white rounded-lg hover:bg-[#3dcab1]/90 transition-colors"
              title="Mostra criteri simili"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm">Criteri Simili</span>
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4">{criterio.descrizione}</p>
      
      {criterio.subCriteri?.length > 0 && (
        <div className="mt-4">
          {criterio.subCriteri.map((subCriterio) => (
            <CriterioCard
              key={subCriterio.id}
              criterio={subCriterio}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {showSimilar && (
        <SimilarCriteria
          similarCriteria={criterio.criteriSimili || []}
          onClose={() => setShowSimilar(false)}
        />
      )}
    </div>
  );
};

export default function CriteriViewer({ criteri, data }: Props) {
  const [showJson, setShowJson] = useState(false);

  if (!criteri?.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Criteri di Valutazione</h2>
        <button
          onClick={() => setShowJson(!showJson)}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showJson ? "Mostra Criteri" : "Mostra JSON"}
        </button>
      </div>

      {showJson ? (
        <JsonViewer data={data} />
      ) : (
        <div>
          {criteri.map((criterio) => (
            <CriterioCard key={criterio.id} criterio={criterio} />
          ))}
        </div>
      )}
    </div>
  );
} 