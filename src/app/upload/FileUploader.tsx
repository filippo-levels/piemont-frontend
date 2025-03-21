import React, { useState, Dispatch, SetStateAction, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import axios from "axios";
import DragDropArea from "./components/DragDropArea";
import LogDisplay from "./components/LogDisplay";
import JsonDebugViewer, { clearAllJsonDebugData, getStoredJsonData } from "./components/JsonDebugViewer";

interface FileUploaderProps {
  setLogs: Dispatch<SetStateAction<string[]>>;
  setJsonResult: (data: any) => void;
  setElapsedTime: (time: number) => void;
  setExecutiveSummary: (data: any) => void;
  onRemove?: () => void;
}

const FileUploader = forwardRef<{ setFileFromExternal: (newFile: File) => void }, FileUploaderProps>(
  ({ setLogs, setJsonResult, setElapsedTime, setExecutiveSummary, onRemove }, ref) => {
    const [file, setFile] = useState<File | null>(null);
    const [currentLog, setCurrentLog] = useState<string>("");
    const [showElapsedTime, setShowElapsedTime] = useState(false);
    const [currentElapsedTime, setCurrentElapsedTime] = useState(0);
    const [onlyCriteria, setOnlyCriteria] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    
    // API responses tracking
    const [fullAnalyzeLoading, setFullAnalyzeLoading] = useState(false);
    const [executiveSummaryLoading, setExecutiveSummaryLoading] = useState(false);
    
    // Debug JSON responses
    const [criteriJsonResponse, setCriteriJsonResponse] = useState<any>(null);
    const [executiveSummaryJsonResponse, setExecutiveSummaryJsonResponse] = useState<any>(null);

    // Load saved JSON responses from localStorage on component mount
    useEffect(() => {
      const savedCriteriJson = getStoredJsonData('criteri');
      const savedExecutiveJson = getStoredJsonData('executive');
      
      if (savedCriteriJson) {
        setCriteriJsonResponse(savedCriteriJson);
      }
      
      if (savedExecutiveJson) {
        setExecutiveSummaryJsonResponse(savedExecutiveJson);
      }
    }, []);

    const updateElapsedTime = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTimeRef.current) / 1000;
      setElapsedTime(elapsed);
      setCurrentElapsedTime(elapsed);
    };

    const handleFileSelect = (selectedFile: File) => {
      setFile(selectedFile);
      const logMessage = `📄 File selezionato: ${selectedFile.name}`;
      setCurrentLog(logMessage);
      setLogs((prev: string[]) => [...prev, logMessage]);
      setJsonResult(null);
      setElapsedTime(0);
      setCurrentElapsedTime(0);
      setShowElapsedTime(false);
    };

    const handleAnalyzeCriteri = async () => {
      if (!file) {
        const logMessage = "⚠️ Nessun file selezionato";
        setCurrentLog(logMessage);
        setLogs((prev: string[]) => [...prev, logMessage]);
        return;
      }
      setFullAnalyzeLoading(true);
      setElapsedTime(0);
      setCurrentElapsedTime(0);
      setShowElapsedTime(true);
      const logMessage = "⌛ Estrazione criteri in corso...";
      setCurrentLog(logMessage);
      setLogs((prev: string[]) => [...prev, logMessage]);

      startTimeRef.current = Date.now();
      timerRef.current = setInterval(updateElapsedTime, 100);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("bool_short", onlyCriteria.toString());

      try {
        // Call criterias_extraction API
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/criterias_extraction`,
          formData
        );

        // Store raw response for debugging
        setCriteriJsonResponse(response.data);

        // Extract data according to the schema
        const responseData = response.data;
        
        if (responseData && responseData.criteri) {
          // Set the data with the file name and criteri from the response
          setJsonResult({
            file_name: file.name,
            criteri: responseData.criteri
          });
          
          const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
          const completionMessage = `✅ Estrazione criteri completata con successo in ${timeElapsed.toFixed(2)} secondi`;
          setCurrentLog(completionMessage);
          setLogs((prev: string[]) => [...prev, completionMessage]);
        } else if (responseData && responseData.data && responseData.data.criteri) {
          // Alternative structure if the API returns data wrapped in a 'data' property
          setJsonResult({
            file_name: file.name,
            criteri: responseData.data.criteri
          });
          
          const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
          const completionMessage = `✅ Estrazione criteri completata con successo in ${timeElapsed.toFixed(2)} secondi.`;
          setCurrentLog(completionMessage);
          setLogs((prev: string[]) => [...prev, completionMessage]);
        } else {
          // Log the raw response structure to help debug
          console.log("API Response structure:", responseData);
          const errorMessage = "⚠️ Formato di risposta non riconosciuto. Controlla il JSON di debug per maggiori dettagli.";
          setCurrentLog(errorMessage);
          setLogs((prev: string[]) => [...prev, errorMessage]);
        }
      } catch (error: any) {
        const errorMessage = `❌ Errore nell'estrazione criteri: ${error.message}`;
        setCurrentLog(errorMessage);
        setLogs((prev: string[]) => [...prev, errorMessage]);
      } finally {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setFullAnalyzeLoading(false);
      }
    };

    const handleExecutiveSummary = async () => {
      if (!file) {
        const logMessage = "⚠️ Nessun file selezionato";
        setCurrentLog(logMessage);
        setLogs((prev: string[]) => [...prev, logMessage]);
        return;
      }
      setExecutiveSummaryLoading(true);
      setElapsedTime(0);
      setCurrentElapsedTime(0);
      setShowElapsedTime(true);
      const logMessage = "⌛ Generazione executive summary in corso...";
      setCurrentLog(logMessage);
      setLogs((prev: string[]) => [...prev, logMessage]);

      startTimeRef.current = Date.now();
      timerRef.current = setInterval(updateElapsedTime, 100);

      const formData = new FormData();
      formData.append("file", file);

      try {
        // Call executive_summary API
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/executive_summary`,
          formData
        );

        // Store raw response for debugging
        setExecutiveSummaryJsonResponse(response.data);

        const responseData = response.data;
        
        if (responseData) {
          // Set the executive summary directly from the response
          setExecutiveSummary(responseData);
          
          const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
          const completionMessage = `✅ Executive summary generato con successo in ${timeElapsed.toFixed(2)} secondi.`;
          setCurrentLog(completionMessage);
          setLogs((prev: string[]) => [...prev, completionMessage]);
        } else if (responseData && responseData.data) {
          // Alternative handling if the API returns data wrapped in a 'data' property
          setExecutiveSummary(responseData.data);
          
          const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
          const completionMessage = `✅ Executive summary generato con successo in ${timeElapsed.toFixed(2)} secondi.`;
          setCurrentLog(completionMessage);
          setLogs((prev: string[]) => [...prev, completionMessage]);
        } else {
          // Log the raw response structure to help debug
          console.log("API Response structure:", responseData);
          const errorMessage = "⚠️ Formato di risposta non riconosciuto. Controlla il JSON di debug per maggiori dettagli.";
          setCurrentLog(errorMessage);
          setLogs((prev: string[]) => [...prev, errorMessage]);
        }
      } catch (error: any) {
        const errorMessage = `❌ Errore nella generazione dell'executive summary: ${error.message}`;
        setCurrentLog(errorMessage);
        setLogs((prev: string[]) => [...prev, errorMessage]);
      } finally {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setExecutiveSummaryLoading(false);
      }
    };

    const handleRemove = () => {
      setFile(null);
      const logMessage = "🗑️ File rimosso";
      setCurrentLog(logMessage);
      setLogs((prev: string[]) => [...prev, logMessage]);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Clear debug JSON
      setCriteriJsonResponse(null);
      setExecutiveSummaryJsonResponse(null);
      clearAllJsonDebugData();
      
      // Refresh the page
      if (onRemove) {
        onRemove();
        // Reload the page after removing analysis
        window.location.reload();
      }
    };

    // Cleanup timer on unmount
    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, []);

    // Load selected disciplinare if available
    useEffect(() => {
      const loadSelectedDisciplinare = async () => {
        const selectedDisciplinareData = localStorage.getItem('selectedDisciplinare');
        
        if (selectedDisciplinareData) {
          try {
            const fileData = JSON.parse(selectedDisciplinareData);
            const loadingMessage = `⌛ Caricamento del file ${fileData.filename} in corso...`;
            setCurrentLog(loadingMessage);
            setLogs((prev: string[]) => [...prev, loadingMessage]);
            
            // Download the file using the temporary URL
            const response = await fetch(fileData.url);
            
            if (!response.ok) {
              throw new Error(`Errore nel download del file: ${response.statusText}`);
            }
            
            // Convert the response to a blob
            const fileBlob = await response.blob();
            
            // Create a File object from the blob
            const fileObject = new File(
              [fileBlob], 
              fileData.filename, 
              { type: fileData.contentType || 'application/pdf' }
            );
            
            // Set the file
            handleFileSelect(fileObject);
            
            // Clean up localStorage
            localStorage.removeItem('selectedDisciplinare');
            
          } catch (error) {
            console.error('Errore durante il caricamento del file:', error);
            const errorMessage = `❌ Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`;
            setCurrentLog(errorMessage);
            setLogs((prev: string[]) => [...prev, errorMessage]);
            localStorage.removeItem('selectedDisciplinare');
          }
        }
      };
      
      loadSelectedDisciplinare();
    }, []);

    // Expose the setFile function
    useImperativeHandle(ref, () => ({
      setFileFromExternal: (newFile: File) => {
        handleFileSelect(newFile);
      }
    }));

    return (
      <div className="w-full mx-auto">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* File upload area */}
          <DragDropArea 
            onFileSelect={handleFileSelect} 
            file={file} 
          />
          
          {/* Checkbox for "only criteria" option */}
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <input
              id="only-criteria-checkbox"
              type="checkbox"
              checked={onlyCriteria}
              onChange={(e) => setOnlyCriteria(e.target.checked)}
              className="w-4 h-4 text-[#3dcab1] bg-gray-100 border-gray-300 rounded focus:ring-[#3dcab1] focus:ring-2"
            />
            <label htmlFor="only-criteria-checkbox" className="ml-2 text-sm font-medium text-gray-700">
              File con solo criteri
            </label>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleAnalyzeCriteri}
              disabled={!file || fullAnalyzeLoading || executiveSummaryLoading}
              className={`flex-1 px-4 py-3 rounded-lg text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                !file ? 'bg-gray-400 cursor-not-allowed opacity-60' : 
                'bg-[#3dcab1] hover:bg-[#32a594] shadow-md hover:shadow-lg'
              }`}
            >
              {fullAnalyzeLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analisi in corso...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>Estrai Criteri</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleExecutiveSummary}
              disabled={!file || fullAnalyzeLoading || executiveSummaryLoading}
              className={`px-4 py-3 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                !file ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60' : 
                'bg-white border-2 border-[#3dcab1] text-[#3dcab1] hover:bg-gray-50'
              }`}
            >
              {executiveSummaryLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-[#3dcab1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generazione in corso...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Executive Summary</span>
                </>
              )}
            </button>
          </div>
          
          
          {/* Log display with enhanced styling */}
          <div className="mt-2">
            <LogDisplay 
              currentLog={currentLog}
              showElapsedTime={showElapsedTime}
              currentElapsedTime={currentElapsedTime}
            />
          </div>
          
          {/* Debug JSON viewers */}
          <div className="flex flex-col gap-2 mt-2">
            {criteriJsonResponse && (
              <JsonDebugViewer 
                type="criteri" 
                jsonData={criteriJsonResponse} 
              />
            )}
            
            {executiveSummaryJsonResponse && (
              <JsonDebugViewer 
                type="executive" 
                jsonData={executiveSummaryJsonResponse} 
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

FileUploader.displayName = "FileUploader";

export default FileUploader;