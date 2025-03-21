"use client";

import React, { useState, createContext, useContext } from "react";
import CriterioCard from "../../components/CriterioCard";
import { Criterio } from "../../types/criterio";

interface Props {
  criteri: Criterio[];
}

// Create a context for collapse state management
export const CollapseContext = createContext<{
  collapsedItems: Set<string>;
  toggleCollapse: (id: string) => void;
  collapseAll: () => void;
  expandAll: () => void;
  isCollapsed: (id: string) => boolean;
  expandedDescriptions: Set<string>;
  toggleDescription: (id: string) => void;
}>({
  collapsedItems: new Set<string>(),
  toggleCollapse: () => {},
  collapseAll: () => {},
  expandAll: () => {},
  isCollapsed: () => false,
  expandedDescriptions: new Set<string>(),
  toggleDescription: () => {}
});

// Custom hook for using the collapse context
export const useCollapseState = () => useContext(CollapseContext);

export default function CriteriSimiliViewer({ criteri }: Props) {
  const [collapsedItems, setCollapsedItems] = useState(new Set<string>());
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set<string>());
  const [forceUpdate, setForceUpdate] = useState(0); // Used to force re-renders
  
  if (!criteri?.length) return null;

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

  // Toggle description expansion
  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Provider values for context
  const contextValue = {
    collapsedItems,
    toggleCollapse,
    collapseAll,
    expandAll,
    isCollapsed,
    expandedDescriptions,
    toggleDescription
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
            
            {/* Pulsante per modalità compatta */}
            <button
              onClick={() => setExpandedDescriptions(new Set())}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
              title="Modalità compatta"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8" />
              </svg>
              Compatta
            </button>
          </div>
        </div>

        <div>
          {/* Mostra direttamente i criteri dall'array */}
          {criteri.map((criterio) => (
            <CriterioCard 
              key={criterio.id} 
              criterio={criterio}
              collapsed={isCollapsed(criterio.id)}
              toggleCollapse={toggleCollapse}
              expandedDescriptions={expandedDescriptions}
              toggleDescription={toggleDescription}
            />
          ))}
        </div>
      </div>
    </CollapseContext.Provider>
  );
}