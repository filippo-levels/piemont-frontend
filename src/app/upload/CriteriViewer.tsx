"use client";

import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import JsonViewer from "../../components/JsonViewer";
import ConsegnaList from "../../components/ConsegnaList";
import { generatePDF } from "../../utils/pdfGenerator";

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

// Create a context for collapse state management
const CollapseContext = createContext<{
  collapsedItems: Set<string>;
  toggleCollapse: (id: string) => void;
  collapseAll: () => void;
  expandAll: () => void;
  isCollapsed: (id: string) => boolean;
}>({
  collapsedItems: new Set<string>(),
  toggleCollapse: () => {},
  collapseAll: () => {},
  expandAll: () => {},
  isCollapsed: () => false
});

// Custom hook for using the collapse context
const useCollapseState = () => useContext(CollapseContext);

const CriterioCard: React.FC<{ criterio: Criterio; level?: number }> = ({
  criterio,
  level = 0,
}) => {
  const [showConsegnaList, setShowConsegnaList] = useState(false);
  const [searchFileName, setSearchFileName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSimilarCriterio, setSelectedSimilarCriterio] = useState<{
    id: string;
    score: number;
    documents: string;
    criterio_id: string;
    filename: string;
  } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  
  const { isCollapsed, toggleCollapse } = useCollapseState();
  const collapsed = isCollapsed(criterio.id);
  
  const hasSimilarCriteria = criterio.criteriSimili?.length > 0;
  const hasSubCriteria = criterio.subCriteri?.length > 0;
  const criterioRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Check if title is too long and needs tooltip
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  
  useEffect(() => {
    if (titleRef.current) {
      setIsTitleTruncated(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  }, [criterio.nome]);

  const handleCloseConsegnaList = () => {
    setShowConsegnaList(false);
    setSearchFileName("");
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
  
  const openDisciplinare = (filename: string) => {
    try {
      // Rimuove .json se presente e aggiunge .pdf
      const fileName = filename.replace('.json', '') + '.pdf';
      window.open(`http://localhost:8000/api/view_file/${fileName}`, '_blank');
    } catch (error) {
      console.error('Errore nell\'apertura del file:', error);
      alert('File non trovato o errore nell\'apertura del file');
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 md:p-5 mb-5 shadow-sm hover:shadow-md transition-all duration-200 ${
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
          <ConsegnaList initialSearchTerm={searchFileName} singleColumn={true} />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-3 gap-2">
            <div className="flex items-center flex-grow min-w-0 group relative">
              <button 
                onClick={() => toggleCollapse(criterio.id)}
                className="mr-2 p-1 text-gray-500 hover:text-gray-800 focus:outline-none transition-colors flex-shrink-0"
                aria-label={collapsed ? "Espandi" : "Comprimi"}
              >
                <svg className={`w-5 h-5 transform transition-transform ${collapsed ? "" : "rotate-90"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div 
                ref={titleRef} 
                className="truncate max-w-full flex items-center" 
              >
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {criterio.id} - {criterio.nome}
                </h3>
                {isTitleTruncated && (
                  <button
                    onClick={() => setShowFullTitle(!showFullTitle)}
                    className="ml-2 p-1 text-gray-500 hover:text-blue-600 focus:outline-none transition-colors flex-shrink-0 bg-gray-100 hover:bg-gray-200 rounded-full"
                    title="Visualizza titolo completo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
                {/* Dialog for long titles */}
                {showFullTitle && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center" onClick={() => setShowFullTitle(false)}>
                    <div className="bg-white rounded-lg p-4 shadow-xl max-w-lg m-4" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">Titolo completo</h4>
                        <button 
                          onClick={() => setShowFullTitle(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-700 break-words">
                        {criterio.id} - {criterio.nome}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-md min-w-12 text-center text-sm">
                {criterio.punteggioMassimo}
              </span>
              {hasSimilarCriteria && (
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-1 px-2 py-1.5 md:px-3 md:py-1.5 bg-[#3dcab1] text-white rounded-lg hover:bg-[#3dcab1]/90 transition-colors"
                  title="Mostra criteri simili"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">Criteri Simili</span>
                </button>
              )}
              <button
                onClick={() => copyToClipboard(criterio.descrizione)}
                className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full flex-shrink-0"
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

          {!collapsed && (
            <div className="relative">
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">{criterio.descrizione}</p>
            </div>
          )}
          
          {/* Modal for showing criterio and similar criteria side by side */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
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
                      <div className="mb-3">
                        <h4 className="text-lg font-semibold text-gray-800 mb-1 break-words">
                          {criterio.id} - {criterio.nome}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-2 mr-2">
                            <span className="text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-md text-center">
                              {criterio.punteggioMassimo} punti
                            </span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(criterio.descrizione)}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full flex-shrink-0"
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
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-gray-700 text-sm leading-relaxed">{criterio.descrizione}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Middle section - Similar Criteria List */}
                  <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Criteri Simili</h4>
                    
                    {/* List of all criteria */}
                    <div className="space-y-2">
                      {criterio.criteriSimili.map((similarCriterio) => (
                          <div 
                            key={similarCriterio.id}
                            className={`border rounded-lg p-3 bg-white shadow-sm cursor-pointer transition-all duration-200 ${
                              selectedSimilarCriterio?.id === similarCriterio.id 
                                ? 'border-[#3dcab1] ring-2 ring-[#3dcab1] ring-opacity-50' 
                                : 'hover:border-[#3dcab1]'
                            }`}
                            onClick={() => handleSelectSimilarCriterio(similarCriterio)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium text-gray-800 text-sm">ID: {similarCriterio.criterio_id}</h5>
                                <p className="text-xs text-gray-500 truncate">{similarCriterio.filename.replace('.json', '')}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-[#3dcab1]/10 text-[#3dcab1] px-2 py-0.5 rounded-full text-xs font-medium">
                                  {Math.floor(similarCriterio.score)}%
                                </span>
                                {selectedSimilarCriterio?.id === similarCriterio.id && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(similarCriterio.documents);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 rounded-full flex-shrink-0"
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
                                )}
                              </div>
                            </div>
                            
                            {selectedSimilarCriterio?.id === similarCriterio.id ? (
                              <>
                                <p className="text-sm text-gray-700 leading-relaxed my-2 border-t border-b border-gray-100 py-2">
                                  {similarCriterio.documents}
                                </p>
                                <div className="mt-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDisciplinare(similarCriterio.filename);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center text-sm"
                                    title="Apri il disciplinare in una nuova finestra"
                                  >
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Apri PDF
                                  </button>
                                </div>
                              </>
                            ) : (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{similarCriterio.documents}</p>
                            )}
                          </div>
                        ))}
                    </div>
                    
                    {!selectedSimilarCriterio && criterio.criteriSimili.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-center">Nessun criterio simile disponibile</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - ConsegnaList */}
                  <div className="w-full md:w-1/3 overflow-y-auto bg-white">
                    {selectedSimilarCriterio ? (
                      <ConsegnaList initialSearchTerm={selectedSimilarCriterio.filename.replace('.json', '')} singleColumn={true} />
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
      
      {!collapsed && criterio.subCriteri?.length > 0 && (
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
  const [collapsedItems, setCollapsedItems] = useState(new Set<string>());
  const [forceUpdate, setForceUpdate] = useState(0); // Used to force re-renders
  
  if (!criteri?.length) return null;

  const handleExportToPDF = () => {
    generatePDF(criteri);
  };

  // Handlers for collapse state
  const toggleCollapse = (id: string) => {
    setCollapsedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const isCollapsed = (id: string) => {
    return collapsedItems.has(id);
  };
  
  // Collect all criteria IDs recursively
  const collectAllCriteriaIds = (criteriaItems: Criterio[]): Set<string> => {
    const ids = new Set<string>();
    
    const addIds = (items: Criterio[]) => {
      items.forEach(item => {
        ids.add(item.id);
        if (item.subCriteri?.length) {
          addIds(item.subCriteri);
        }
      });
    };
    
    addIds(criteriaItems);
    return ids;
  };
  
  // Collapse all criteria
  const collapseAll = () => {
    const allIds = collectAllCriteriaIds(criteri);
    setCollapsedItems(allIds);
    setForceUpdate(prev => prev + 1); // Force update
  };
  
  // Expand all criteria
  const expandAll = () => {
    setCollapsedItems(new Set());
    setForceUpdate(prev => prev + 1); // Force update
  };
  
  // Toggle all criteria
  const toggleAllCriteria = () => {
    if (collapsedItems.size > 0) {
      expandAll();
    } else {
      collapseAll();
    }
  };

  // Provider values for context
  const contextValue = {
    collapsedItems,
    toggleCollapse,
    collapseAll,
    expandAll,
    isCollapsed
  };

  return (
    <CollapseContext.Provider value={contextValue}>
      <div className="space-y-6 bg-gray-50 p-4 md:p-6 rounded-xl" key={forceUpdate}>
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Criteri di Valutazione</h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={toggleAllCriteria}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
              title={collapsedItems.size > 0 ? "Espandi tutti i criteri" : "Comprimi tutti i criteri"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {collapsedItems.size > 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              {collapsedItems.size > 0 ? "Espandi tutti" : "Comprimi tutti"}
            </button>
            <button
              onClick={handleExportToPDF}
              className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
              title="Scarica PDF con tutti i criteri"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Scarica PDF
            </button>
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
              <CriterioCard 
                key={criterio.id} 
                criterio={criterio}
              />
            ))}
          </div>
        )}
      </div>
    </CollapseContext.Provider>
  );
}