"use client";

import React, { useState, useRef } from "react";
import JsonViewer from "./JsonViewer";
import * as XLSX from 'xlsx';
import ConsegnaList from "./ConsegnaList";

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
  const [showConsegnaList, setShowConsegnaList] = useState(false);
  const [searchFileName, setSearchFileName] = useState("");
  const [focusedCriterioId, setFocusedCriterioId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSimilarCriterio, setSelectedSimilarCriterio] = useState<{
    id: string;
    score: number;
    documents: string;
    criterio_id: string;
    filename: string;
  } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const hasSimilarCriteria = criterio.criteriSimili?.length > 0;
  const criterioRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleFileClick = (filename: string) => {
    // Extract filename without .json extension
    const searchTerm = filename.replace('.json', '');
    setSearchFileName(searchTerm);
    setShowConsegnaList(true);
  };

  const handleCloseConsegnaList = () => {
    setShowConsegnaList(false);
    setSearchFileName("");
  };

  const handleCriterioFocus = (id: string) => {
    setFocusedCriterioId(id);
    
    // Scroll to the focused criterio with smooth behavior
    if (criterioRefs.current[id]) {
      criterioRefs.current[id]?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSimilarCriterio(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const handleSelectSimilarCriterio = (similarCriterio: {
    id: string;
    score: number;
    documents: string;
    criterio_id: string;
    filename: string;
  }) => {
    setSelectedSimilarCriterio(similarCriterio);
    setFocusedCriterioId(similarCriterio.id);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <div
      className={`border rounded-lg p-5 mb-5 shadow-sm hover:shadow-md transition-shadow ${
        level === 0 ? "bg-white" : "bg-gray-50"
      }`}
      style={{ marginLeft: `${level * 20}px` }}
      ref={(el) => criterioRefs.current[criterio.id] = el}
    >
      {showConsegnaList ? (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Ricerca file: {searchFileName}
            </h3>
            <button
              onClick={handleCloseConsegnaList}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Torna ai criteri
            </button>
          </div>
          <ConsegnaList initialSearchTerm={searchFileName} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {criterio.id} - {criterio.nome}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-md">
                {criterio.punteggioMassimo}
              </span>
              {hasSimilarCriteria && (
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#3dcab1] text-white rounded-lg hover:bg-[#3dcab1]/90 transition-colors"
                  title="Mostra criteri simili"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm font-medium">Criteri Simili</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <p className="text-gray-700 text-sm mb-4 leading-relaxed pr-10">{criterio.descrizione}</p>
            <button
              onClick={() => copyToClipboard(criterio.descrizione)}
              className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Copia testo del criterio"
            >
              {copySuccess ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Modal for showing criterio and similar criteria side by side */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Criterio e Criteri Simili
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                  {/* Left side - Selected Criterio */}
                  <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {criterio.id} - {criterio.nome}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-md">
                            {criterio.punteggioMassimo}
                          </span>
                          <button
                            onClick={() => copyToClipboard(criterio.descrizione)}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 rounded-full"
                            title="Copia testo del criterio"
                          >
                            {copySuccess ? (
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{criterio.descrizione}</p>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Criteri Simili</h4>
                      <div className="space-y-3">
                        {criterio.criteriSimili.map((similarCriterio) => (
                          <div 
                            key={similarCriterio.id}
                            className={`border rounded-lg p-3 transition-all duration-300 bg-white shadow-sm cursor-pointer ${
                              selectedSimilarCriterio?.id === similarCriterio.id 
                                ? 'border-[#3dcab1] ring-2 ring-[#3dcab1] ring-opacity-50' 
                                : 'hover:border-[#3dcab1]'
                            }`}
                            onClick={() => handleSelectSimilarCriterio(similarCriterio)}
                          >
                            <div className="flex justify-between items-start">
                              <h5 className="font-medium text-gray-800">ID: {similarCriterio.criterio_id}</h5>
                              <div className="bg-[#3dcab1]/10 text-[#3dcab1] px-2 py-0.5 rounded-full text-xs font-medium">
                                {(similarCriterio.score * 100).toFixed(1)}%
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{similarCriterio.documents}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Middle section - Selected Similar Criterio */}
                  <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r bg-gray-50">
                    {selectedSimilarCriterio ? (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-gray-800">
                            ID Criterio: {selectedSimilarCriterio.criterio_id}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="bg-[#3dcab1]/10 text-[#3dcab1] px-3 py-1 rounded-full text-sm font-medium">
                              Score: {(selectedSimilarCriterio.score * 100).toFixed(1)}%
                            </div>
                            <button
                              onClick={() => copyToClipboard(selectedSimilarCriterio.documents)}
                              className="p-2 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 rounded-full"
                              title="Copia testo del criterio simile"
                            >
                              {copySuccess ? (
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedSimilarCriterio.documents}</p>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setSearchFileName(selectedSimilarCriterio.filename.replace('.json', ''))}
                            className="px-4 py-2 bg-[#3dcab1] text-white rounded-md hover:bg-[#3dcab1]/90 transition-colors flex items-center"
                            title="Visualizza questo file nella lista consegne"
                          >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {selectedSimilarCriterio.filename.replace('.json', '')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-center">Seleziona un criterio simile per visualizzarne i dettagli</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - ConsegnaList */}
                  <div className="w-full md:w-1/3 overflow-y-auto bg-white">
                    {selectedSimilarCriterio ? (
                      <ConsegnaList initialSearchTerm={selectedSimilarCriterio.filename.replace('.json', '')} />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-center">Seleziona un criterio simile per visualizzare la lista consegne</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
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
    </div>
  );
};

export default function CriteriViewer({ criteri, data }: Props) {
  const [showJson, setShowJson] = useState(false);

  if (!criteri?.length) return null;

  // Funzione per preparare i dati per l'export in Excel
  const prepareDataForExport = () => {
    const flattenedData: any[] = [];
    
    const flattenCriteria = (criterio: Criterio, parentId = '') => {
      // Aggiungi il criterio principale
      flattenedData.push({
        'Tipo': 'Criterio Principale',
        'ID': criterio.id,
        'Nome': criterio.nome,
        'Punteggio Massimo': criterio.punteggioMassimo,
        'Descrizione': criterio.descrizione,
        'Parent ID': parentId
      });
      
      // Aggiungi i criteri simili
      if (criterio.criteriSimili?.length > 0) {
        criterio.criteriSimili.forEach(similar => {
          flattenedData.push({
            'Tipo': 'Criterio Simile',
            'ID': similar.criterio_id,
            'Nome': '',
            'Punteggio Massimo': '',
            'Descrizione': similar.documents,
            'Parent ID': criterio.id,
            'Score': (similar.score * 100).toFixed(1) + '%',
            'Filename': similar.filename
          });
        });
      }
      
      // Processa i subcriteri ricorsivamente
      if (criterio.subCriteri?.length > 0) {
        criterio.subCriteri.forEach(sub => {
          flattenCriteria(sub, criterio.id);
        });
      }
    };
    
    // Processa tutti i criteri
    criteri.forEach(criterio => {
      flattenCriteria(criterio);
    });
    
    return flattenedData;
  };

  // Funzione per esportare in Excel
  const exportToExcel = () => {
    const data = prepareDataForExport();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Criteri");
    
    // Genera un nome file con data e ora
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;
    const fileName = `criteri_estratti_${formattedDate}.xlsx`;
    
    // Scarica il file
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">Criteri di Valutazione</h2>
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            title="Scarica Excel con tutti i criteri"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Scarica Excel
          </button>
          <button
            onClick={() => setShowJson(!showJson)}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showJson ? "Mostra Criteri" : "Mostra JSON"}
          </button>
        </div>
      </div>

      {showJson ? (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <JsonViewer data={data} />
        </div>
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