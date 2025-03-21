"use client";

import { useState } from 'react';
import CriterioCard from '../../../components/CriterioCard';
import { Criterio } from '../../../types/criterio';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CriteriaData {
  file_name: string;
  data_ora?: string;
  criteri: Criterio[]; // This should be an array of Criterio objects
  data?: any; // For nested response structure
}

interface CriteriaViewerProps {
  data: CriteriaData;
}

export default function CriteriaViewer({ data }: CriteriaViewerProps) {
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  
  if (!data) {
    return (
      <Alert variant="destructive" className="bg-gray-50 border-gray-200">
        <AlertDescription className="text-center py-4 text-gray-500">
          Nessun criterio disponibile
        </AlertDescription>
      </Alert>
    );
  }
  
  // Handle both the direct structure and the nested structure
  let criteriToDisplay: Criterio[] = [];
  
  if (data.criteri && data.criteri.length > 0) {
    // Direct structure
    criteriToDisplay = data.criteri;
  } else if (data.data && data.data.criteri && data.data.criteri.length > 0) {
    // Nested structure where data is inside a data property
    criteriToDisplay = data.data.criteri;
  }
  
  if (criteriToDisplay.length === 0) {
    return (
      <Alert variant="destructive" className="bg-gray-50 border-gray-200">
        <AlertDescription className="text-center py-4 text-gray-500">
          Nessun criterio disponibile
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsAllExpanded(!isAllExpanded)}
          variant="outline"
          size="sm"
          className="text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isAllExpanded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
            )}
          </svg>
          {isAllExpanded ? 'Comprimi tutti' : 'Espandi tutti'}
        </Button>
      </div>
      
      <div className="space-y-3">
        {criteriToDisplay.map((criterio) => (
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