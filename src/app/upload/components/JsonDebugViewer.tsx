import React, { useState, useEffect } from 'react';

// Storage keys for different types of JSON responses
const CRITERI_JSON_KEY = 'criteriRawJsonResponse';
const EXECUTIVE_SUMMARY_JSON_KEY = 'executiveSummaryRawJsonResponse';

interface JsonDebugViewerProps {
  type: 'criteri' | 'executive';
  jsonData: any;
}

const JsonDebugViewer: React.FC<JsonDebugViewerProps> = ({ type, jsonData }) => {
  const [showJson, setShowJson] = useState(false);
  
  // Determine storage key based on type
  const storageKey = type === 'criteri' ? CRITERI_JSON_KEY : EXECUTIVE_SUMMARY_JSON_KEY;
  
  // Save JSON data to localStorage when it changes
  useEffect(() => {
    if (jsonData) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(jsonData));
      } catch (error) {
        console.error(`Error saving ${type} JSON to localStorage:`, error);
      }
    }
  }, [jsonData, storageKey, type]);
  
  // Button styles vary by type
  const getButtonStyles = () => {
    if (type === 'criteri') {
      return {
        bg: showJson ? 'bg-yellow-100 border-yellow-300' : 'bg-white border-yellow-200',
        hover: 'hover:bg-yellow-50',
        text: showJson ? 'text-yellow-700' : 'text-yellow-600',
        icon: 'text-yellow-500'
      };
    } else {
      return {
        bg: showJson ? 'bg-blue-100 border-blue-300' : 'bg-white border-blue-200',
        hover: 'hover:bg-blue-50',
        text: showJson ? 'text-blue-700' : 'text-blue-600',
        icon: 'text-blue-500'
      };
    }
  };
  
  const styles = getButtonStyles();
  
  // Button text varies by type
  const buttonText = type === 'criteri' 
    ? (showJson ? "Nascondi JSON Criteri" : "Mostra JSON Criteri") 
    : (showJson ? "Nascondi JSON Executive" : "Mostra JSON Executive");
  
  const getToggleIcon = () => {
    if (showJson) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      );
    }
  };
  
  if (!jsonData) return null;
  
  return (
    <div className="mt-3">
      <button
        onClick={() => setShowJson(!showJson)}
        className={`px-4 py-2 text-sm font-medium ${styles.text} ${styles.bg} ${styles.hover} border rounded-lg transition-all flex items-center gap-2 shadow-sm`}
      >
        <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        {buttonText}
        <span className="ml-auto">{getToggleIcon()}</span>
      </button>
      
      {showJson && (
        <div className="mt-3 p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto max-h-[450px] font-mono text-xs shadow-lg border border-gray-700 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="sticky top-0 flex justify-end mb-2">
            <button
              onClick={() => setShowJson(false)}
              className="p-1 bg-gray-800 text-gray-400 hover:text-white rounded-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// Function to clear all debug JSON from localStorage
export const clearAllJsonDebugData = () => {
  localStorage.removeItem(CRITERI_JSON_KEY);
  localStorage.removeItem(EXECUTIVE_SUMMARY_JSON_KEY);
};

// Function to get stored JSON data
export const getStoredJsonData = (type: 'criteri' | 'executive') => {
  const key = type === 'criteri' ? CRITERI_JSON_KEY : EXECUTIVE_SUMMARY_JSON_KEY;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error retrieving ${type} JSON from localStorage:`, error);
    return null;
  }
};

export default JsonDebugViewer; 