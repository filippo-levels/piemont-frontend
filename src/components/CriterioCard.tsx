"use client";

import React, { useState, useRef, useEffect } from "react";
import CriteriSimiliModal from "../app/upload/CriteriSimiliModal";
import { Criterio } from "../types/criterio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CriterioCardProps {
  criterio: Criterio;
  level?: number;
  collapsed?: boolean;
  toggleCollapse?: (id: string) => void;
  isAllExpanded?: boolean;
  expandedDescriptions?: Set<string>;
  toggleDescription?: (id: string) => void;
}

const CriterioCard: React.FC<CriterioCardProps> = ({
  criterio,
  level = 0,
  collapsed,
  toggleCollapse,
  isAllExpanded,
  expandedDescriptions = new Set<string>(),
  toggleDescription = () => {},
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine if we're using internal or external state for collapse
  const isExternalCollapse = toggleCollapse !== undefined && collapsed !== undefined;
  
  // Check if title is too long and needs tooltip
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  
  // Checking if description is expanded
  const isDescriptionExpanded = expandedDescriptions.has(criterio.id);
  
  // Determina se la descrizione è lunga
  const isLongDescription = criterio.descrizione && criterio.descrizione.length > 100;
  const isLongTitle = criterio.nome && criterio.nome.length > 60;
  
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
    <Card 
      className={cn(
        "shadow-sm hover:shadow-md transition-all duration-200 mb-4",
        level === 0 ? "bg-white" : "bg-gray-50",
        isCollapsed ? "cursor-pointer" : ""
      )}
      style={{ marginLeft: `${level * 20}px` }}
      onClick={handleCardClick}
    >
      <CardHeader className="p-4 md:p-5 pb-0">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
          <div className="flex items-center flex-grow min-w-0 group relative">
            <Button 
              onClick={(e) => handleToggleCollapse(e)}
              variant="ghost"
              size="sm"
              className="mr-2 p-1 text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0"
              aria-label={isCollapsed ? "Espandi" : "Comprimi"}
            >
              <svg className={`w-5 h-5 transform transition-transform ${isCollapsed ? "" : "rotate-90"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
            <div 
              ref={titleRef} 
              className="truncate max-w-full flex items-center" 
            >
              <CardTitle className="text-lg font-semibold text-gray-800 truncate">
                {criterio.id} - {criterio.nome}
              </CardTitle>
              {isTitleTruncated && (
                <Button
                  onClick={() => setShowFullTitle(!showFullTitle)}
                  variant="ghost"
                  size="sm"
                  className="ml-2 p-1 text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 rounded-full h-6 w-6"
                  title="Visualizza titolo completo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className="text-blue-600 bg-blue-50 hover:bg-blue-50 px-2 py-1">
              {criterio.punteggioMassimo}
            </Badge>
            {hasSimilarCriteria && (
              <Button
                onClick={handleOpenModal}
                className="flex items-center gap-1 bg-[#3dcab1] hover:bg-[#3dcab1]/90 text-white h-8"
                size="sm"
                title="Mostra criteri simili"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">Criteri Simili</span>
              </Button>
            )}
            <Button
              onClick={() => copyToClipboard(criterio.descrizione)}
              variant="ghost"
              size="sm"
              className="p-1 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full h-8 w-8"
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
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="p-4 md:p-5 pt-3">
          {criterio.descrizione && (
            <div className="mb-4">
              {isLongDescription ? (
                <>
                  <p className={`text-gray-700 text-sm leading-relaxed ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                    {criterio.descrizione}
                  </p>
                  <button
                    onClick={() => toggleDescription(criterio.id)}
                    className="text-blue-500 text-sm mt-1 hover:underline focus:outline-none"
                  >
                    {isDescriptionExpanded ? 'Mostra meno' : 'Mostra altro'}
                  </button>
                </>
              ) : (
                <p className="text-gray-700 text-sm leading-relaxed">{criterio.descrizione}</p>
              )}
            </div>
          )}
          
          {hasSubCriteria && (
            <div className="mt-4">
              {criterio.subCriteri?.map((subCriterio) => (
                <CriterioCard
                  key={subCriterio.id}
                  criterio={subCriterio}
                  level={level + 1}
                  collapsed={isExternalCollapse ? collapsed : undefined}
                  toggleCollapse={isExternalCollapse ? toggleCollapse : undefined}
                  isAllExpanded={isExternalCollapse ? undefined : isAllExpanded}
                  expandedDescriptions={expandedDescriptions}
                  toggleDescription={toggleDescription}
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
      
      {/* Dialog for long titles */}
      <Dialog open={showFullTitle} onOpenChange={setShowFullTitle}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Titolo completo</DialogTitle>
            <DialogClose className="absolute right-4 top-4" />
          </DialogHeader>
          <p className="text-gray-700 break-words">
            {criterio.id} - {criterio.nome}
          </p>
        </DialogContent>
      </Dialog>
      
      {/* Render the modal component here */}
      {showModal && criterio.criteriSimili && (
        <CriteriSimiliModal 
          isOpen={showModal}
          onClose={handleCloseModal}
          criterio={criterio}
        />
      )}
    </Card>
  );
};

export default CriterioCard; 