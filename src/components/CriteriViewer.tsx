"use client";

import React from "react";

interface Criterio {
  nome: string;
  id: string;
  punteggioMassimo: string;
  descrizione: string;
  subCriteri: Criterio[];
}

interface Props {
  criteri: Criterio[];
}

const CriterioCard: React.FC<{ criterio: Criterio; level?: number }> = ({
  criterio,
  level = 0,
}) => {
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
        <span className="text-blue-600 font-medium">{criterio.punteggioMassimo}</span>
      </div>
      <p className="text-gray-700 text-sm mb-4">{criterio.descrizione}</p>
      
      {criterio.subCriteri.length > 0 && (
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
    </div>
  );
};

export default function CriteriViewer({ criteri }: Props) {
  if (!criteri?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Criteri di Valutazione</h2>
      {criteri.map((criterio) => (
        <CriterioCard key={criterio.id} criterio={criterio} />
      ))}
    </div>
  );
} 