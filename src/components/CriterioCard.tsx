"use client";

import React, { useState, useRef, useEffect } from "react";
import CriteriSimiliModal from "../app/upload/CriteriSimiliModal";
import { Criterio } from "../types/criterio";

interface CriterioCardProps {
  criterio: Criterio;
  level?: number;
  collapsed?: boolean;
  toggleCollapse?: (id: string) => void;
  isAllExpanded?: boolean;
}

const CriterioCard: React.FC<CriterioCardProps> = ({
  criterio,
  level = 0,
  collapsed,
  toggleCollapse,
  isAllExpanded,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  
  // Determine if we're using internal or external state for collapse
  const isExternalCollapse = toggleCollapse !== undefined && collapsed !== undefined;
  
  // Check if title is too long and needs tooltip
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  
  useEffect(() => {
    if (titleRef.current) {
      setIsTitleTruncated(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  }, [criterio.nome]);

  // Update internal collapse state when isAllExpanded changes
  useEffect(() => {
    if (isAllExpanded !== undefined) {
      setInternalCollapsed(!isAllExpanded);
    }
  }, [isAllExpanded]);

  const hasSimilarCriteria = criterio.criteriSimili && criterio.criteriSimili.length > 0;
  const hasSubCriteria = criterio.subCriteri && criterio.subCriteri.length > 0;
  
  const isCollapsed = isExternalCollapse ? collapsed : internalCollapsed;

  const handleToggleCollapse = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent propagation to parent elements
    }
    
    if (isExternalCollapse && toggleCollapse) {
      toggleCollapse(criterio.id);
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid toggling if clicking on a button or link
    if (
      e.target instanceof HTMLElement && 
      (e.target.tagName === 'BUTTON' || 
       e.target.tagName === 'A' || 
       e.target.closest('button') || 
       e.target.closest('a'))
    ) {
      return;
    }
    
    // Only expand if the criterio is collapsed
    if (isCollapsed) {
      handleToggleCollapse();
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 md:p-5 mb-5 shadow-sm hover:shadow-md transition-all duration-200 ${
        level === 0 ? "bg-white" : "bg-gray-50"
      } ${isCollapsed ? "cursor-pointer" : ""}`}
      style={{ marginLeft: `${level * 20}px` }}
      onClick={handleCardClick}
    >
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-3 gap-2">
        <div className="flex items-center flex-grow min-w-0 group relative">
          <button 
            onClick={(e) => handleToggleCollapse(e)}
            className="mr-2 p-1 text-gray-500 hover:text-gray-800 focus:outline-none transition-colors flex-shrink-0"
            aria-label={isCollapsed ? "Espandi" : "Comprimi"}
          >
            <svg className={`w-5 h-5 transform transition-transform ${isCollapsed ? "" : "rotate-90"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {!isCollapsed && (
        <div className="relative">
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">{criterio.descrizione}</p>
        </div>
      )}
      
      {/* Render the modal component here */}
      {showModal && criterio.criteriSimili && (
        <CriteriSimiliModal 
          isOpen={showModal}
          onClose={handleCloseModal}
          criterio={criterio}
        />
      )}
      
      {!isCollapsed && hasSubCriteria && (
        <div className="mt-4">
          {criterio.subCriteri?.map((subCriterio) => (
            <CriterioCard
              key={subCriterio.id}
              criterio={subCriterio}
              level={level + 1}
              collapsed={isExternalCollapse ? collapsed : undefined}
              toggleCollapse={isExternalCollapse ? toggleCollapse : undefined}
              isAllExpanded={isExternalCollapse ? undefined : isAllExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CriterioCard; 