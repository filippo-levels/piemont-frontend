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
  
  // Button color varies by type
  const buttonBgColor = type === 'criteri' ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-blue-100 hover:bg-blue-200';
  
  // Button text varies by type
  const buttonText = type === 'criteri' 
    ? (showJson ? "Nascondi JSON Criteri" : "Mostra JSON Criteri") 
    : (showJson ? "Nascondi JSON Executive" : "Mostra JSON Executive");
  
  if (!jsonData) return null;
  
  return (
    <div className="mt-2">
      <button
        onClick={() => setShowJson(!showJson)}
        className={`px-3 py-2 text-sm font-medium text-gray-600 ${buttonBgColor} rounded-lg transition-colors flex items-center gap-1`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        {buttonText}
      </button>
      
      {showJson && (
        <div className="mt-2 p-3 bg-gray-800 text-green-400 rounded-lg overflow-auto max-h-96 font-mono text-xs">
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