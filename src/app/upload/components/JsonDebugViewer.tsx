import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
  
  // Text and styling varies by type
  const typeLabel = type === 'criteri' ? 'Criteri' : 'Executive Summary';
  
  if (!jsonData) return null;
  
  return (
    <motion.div 
      className="mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={() => setShowJson(!showJson)}
        variant="outline"
        className="group w-full justify-between border-primary/10 hover:border-primary/30 hover:bg-primary/5"
      >
        <span className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary group-hover:text-primary" />
          <span className="font-normal">JSON Debug: <span className="font-medium">{typeLabel}</span></span>
        </span>
        <motion.div
          animate={{ rotate: showJson ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </Button>
      
      <AnimatePresence>
        {showJson && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="mt-2 overflow-hidden border border-primary/10">
              <div className="p-0.5 bg-background">
                <div className="p-4 bg-zinc-900 text-green-400 rounded-sm overflow-auto max-h-96 font-mono text-xs">
                  <pre className="whitespace-pre-wrap break-all">{JSON.stringify(jsonData, null, 2)}</pre>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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