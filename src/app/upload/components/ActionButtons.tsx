import React from 'react';

interface ActionButtonsProps {
  onAnalyzeCriteri: () => void;
  onExecutiveSummary: () => void;
  fullAnalyzeLoading: boolean;
  executiveSummaryLoading: boolean;
  isDisabled: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAnalyzeCriteri,
  onExecutiveSummary,
  fullAnalyzeLoading,
  executiveSummaryLoading,
  isDisabled
}) => {
  return (
    <div className="flex flex-row justify-center gap-4">
      {/* Estrazione Criteri Button */}
      <button 
        onClick={onAnalyzeCriteri} 
        disabled={fullAnalyzeLoading || executiveSummaryLoading || isDisabled}
        className="px-6 py-2 bg-[#3dcab1] text-[#fefefe] rounded-lg
          disabled:opacity-50 hover:bg-[#3dcab1]/90 
          transition-all duration-200 font-medium shadow-sm
          hover:shadow-md disabled:hover:shadow-none
          flex items-center justify-center gap-2"
      >
        {fullAnalyzeLoading ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Estrazione in corso...
          </>
        ) : (
          <>
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            ESTRAZIONE CRITERI
          </>
        )}
      </button>

      {/* Executive Summary Button */}
      <button 
        onClick={onExecutiveSummary} 
        disabled={executiveSummaryLoading || fullAnalyzeLoading || isDisabled}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg
          disabled:opacity-50 hover:bg-blue-700 
          transition-all duration-200 font-medium shadow-sm
          hover:shadow-md disabled:hover:shadow-none
          flex items-center justify-center gap-2"
      >
        {executiveSummaryLoading ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generazione in corso...
          </>
        ) : (
          <>
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            EXECUTIVE SUMMARY
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons; 