import React, { useState, Dispatch, SetStateAction, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import axios from "axios";
import DragDropArea from "./components/DragDropArea";
import LogDisplay from "./components/LogDisplay";
import JsonDebugViewer, { clearAllJsonDebugData, getStoredJsonData, checkJsonDebugDataExists } from "./components/JsonDebugViewer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileSpreadsheet, FileText, Timer, BarChart2, X, Check, Loader2, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

// Add this to the top of your file
const cardVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

const iconVariants = {
  idle: { rotate: 0 },
  hover: { rotate: 5, transition: { duration: 0.2, repeat: Infinity, repeatType: "reverse" as const } }
};

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
    
    // Success states
    const [fullAnalyzeSuccess, setFullAnalyzeSuccess] = useState(false);
    const [executiveSummarySuccess, setExecutiveSummarySuccess] = useState(false);
    
    // Debug JSON responses
    const [criteriJsonResponse, setCriteriJsonResponse] = useState<any>(null);
    const [executiveSummaryJsonResponse, setExecutiveSummaryJsonResponse] = useState<any>(null);

    // Load saved JSON responses from localStorage on component mount
    useEffect(() => {
      console.log('FileUploader mounted, checking for saved JSON data:');
      checkJsonDebugDataExists();
      
      const savedCriteriJson = getStoredJsonData('criteri');
      const savedExecutiveJson = getStoredJsonData('executive');
      
      if (savedCriteriJson) {
        console.log('Restoring criteri JSON from localStorage');
        setCriteriJsonResponse(savedCriteriJson);
        setFullAnalyzeSuccess(true);
      }
      
      if (savedExecutiveJson) {
        console.log('Restoring executive summary JSON from localStorage');
        setExecutiveSummaryJsonResponse(savedExecutiveJson);
        setExecutiveSummarySuccess(true);
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
      setFullAnalyzeSuccess(false);
      setExecutiveSummarySuccess(false);
    };

    const handleAnalyzeCriteri = async () => {
      if (!file) {
        const logMessage = "⚠️ Nessun file selezionato";
        setCurrentLog(logMessage);
        setLogs((prev: string[]) => [...prev, logMessage]);
        return;
      }
      setFullAnalyzeLoading(true);
      setFullAnalyzeSuccess(false);
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
          setFullAnalyzeSuccess(true);
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
      setExecutiveSummarySuccess(false);
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
          setExecutiveSummarySuccess(true);
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
      
      // Reset UI states
      setJsonResult(null);
      setElapsedTime(0);
      setCurrentElapsedTime(0);
      setShowElapsedTime(false);
      
      // Check if JSON debug data exists before clearing
      console.log('Before clearing localStorage:');
      checkJsonDebugDataExists();
      
      // Clear debug JSON data - use direct localStorage removal for redundancy
      try {
        // Manual removal of localStorage items
        window.localStorage.removeItem('criteriRawJsonResponse');
        window.localStorage.removeItem('executiveSummaryRawJsonResponse');
        
        // Also call the utility function
        clearAllJsonDebugData();
        
        console.log('Debug JSON data cleared manually and via utility');
        
        // Verify data was cleared
        console.log('After clearing localStorage:');
        checkJsonDebugDataExists();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
      
      // Reset state to clear UI
      setCriteriJsonResponse(null);
      setExecutiveSummaryJsonResponse(null);
      setFullAnalyzeSuccess(false);
      setExecutiveSummarySuccess(false);
      
      // Run onRemove callback if provided
      if (onRemove) {
        onRemove();
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
        <div className="flex flex-col gap-6">
          {/* File upload area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DragDropArea 
              onFileSelect={handleFileSelect} 
              file={file} 
            />
          </motion.div>
          
          {/* Action buttons and options */}
          <div className="flex flex-col gap-6">
            {/* Options */}
            <motion.div 
              className="flex items-center justify-between px-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <Switch
                  id="only-criteria-checkbox"
                  checked={onlyCriteria}
                  onCheckedChange={setOnlyCriteria}
                  className="data-[state=checked]:bg-primary"
                />
                <Label 
                  htmlFor="only-criteria-checkbox" 
                  className="text-sm cursor-pointer select-none"
                >
                  File con solo criteri
                </Label>
              </div>
              
              {file && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={handleRemove}
                    variant="ghost"
                    className="text-sm flex items-center gap-1 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                    Rimuovi file
                  </Button>
                </motion.div>
              )}
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {/* Estrazione Criteri Button */}
              <motion.div
                variants={cardVariants}
                initial="idle"
                whileHover={!fullAnalyzeLoading && !executiveSummaryLoading ? "hover" : "idle"}
              >
                <Card 
                  className={`relative overflow-hidden border cursor-pointer transition-all duration-300 h-full
                    ${fullAnalyzeSuccess ? 'border-green-500/50 bg-green-50/30' : 
                      fullAnalyzeLoading ? 'border-primary/50 bg-primary/5' : 
                      'border-primary/20 hover:border-primary/50 hover:shadow-sm bg-blue-50 dark:bg-blue-950/30'}`}
                  onClick={!fullAnalyzeLoading && !executiveSummaryLoading ? handleAnalyzeCriteri : undefined}
                >
                  <div className="p-5 flex flex-col items-center justify-center h-full">
                    <motion.div 
                      variants={iconVariants}
                      initial="idle"
                      whileHover={!fullAnalyzeLoading ? "hover" : "idle"}
                      className={`rounded-full p-3 mb-3 ${
                        fullAnalyzeSuccess ? 'bg-green-100' : 
                        fullAnalyzeLoading ? 'bg-primary/20' : 
                        'bg-blue-200 dark:bg-blue-800/70'
                      }`}
                    >
                      {fullAnalyzeSuccess ? (
                        <Check className="h-6 w-6 text-green-500" />
                      ) : fullAnalyzeLoading ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      ) : (
                        <FileSpreadsheet className="h-6 w-6 text-primary" />
                      )}
                    </motion.div>
                    <h3 className={`font-medium text-center ${fullAnalyzeSuccess ? 'text-green-600' : ''}`}>
                      Estrazione Criteri
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      Analizza il documento ed estrai tutti i criteri tecnici presenti
                    </p>
                    {fullAnalyzeLoading && (
                      <div className="mt-3 flex items-center text-xs text-primary">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        In elaborazione...
                      </div>
                    )}
                    {fullAnalyzeSuccess && !fullAnalyzeLoading && (
                      <div className="mt-3 flex items-center text-xs text-green-500">
                        <Check className="h-3 w-3 mr-1" />
                        Analisi completata
                      </div>
                    )}
                  </div>
                  {fullAnalyzeLoading && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary/20">
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${Math.min(currentElapsedTime * 5, 100)}%` }}
                        transition={{ ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </Card>
              </motion.div>
              
              {/* Executive Summary Button */}
              <motion.div
                variants={cardVariants}
                initial="idle"
                whileHover={!executiveSummaryLoading && !fullAnalyzeLoading ? "hover" : "idle"}
              >
                <Card 
                  className={`relative overflow-hidden border cursor-pointer transition-all duration-300 h-full
                    ${executiveSummarySuccess ? 'border-green-500/50 bg-green-50/30' : 
                      executiveSummaryLoading ? 'border-primary/50 bg-primary/5' : 
                      'border-primary/20 hover:border-primary/50 hover:shadow-sm bg-purple-50 dark:bg-purple-950/30'}`}
                  onClick={!executiveSummaryLoading && !fullAnalyzeLoading ? handleExecutiveSummary : undefined}
                >
                  <div className="p-5 flex flex-col items-center justify-center h-full">
                    <motion.div 
                      variants={iconVariants}
                      initial="idle"
                      whileHover={!executiveSummaryLoading ? "hover" : "idle"}
                      className={`rounded-full p-3 mb-3 ${
                        executiveSummarySuccess ? 'bg-green-100' : 
                        executiveSummaryLoading ? 'bg-primary/20' : 
                        'bg-purple-200 dark:bg-purple-800/70'
                      }`}
                    >
                      {executiveSummarySuccess ? (
                        <Check className="h-6 w-6 text-green-500" />
                      ) : executiveSummaryLoading ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      ) : (
                        <BarChart2 className="h-6 w-6 text-primary" />
                      )}
                    </motion.div>
                    <h3 className={`font-medium text-center ${executiveSummarySuccess ? 'text-green-600' : ''}`}>
                      Executive Summary
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      Genera un riepilogo dettagliato dell'intero documento
                    </p>
                    {executiveSummaryLoading && (
                      <div className="mt-3 flex items-center text-xs text-primary">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        In elaborazione...
                      </div>
                    )}
                    {executiveSummarySuccess && !executiveSummaryLoading && (
                      <div className="mt-3 flex items-center text-xs text-green-500">
                        <Check className="h-3 w-3 mr-1" />
                        Analisi completata
                      </div>
                    )}
                  </div>
                  {executiveSummaryLoading && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary/20">
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${Math.min(currentElapsedTime * 5, 100)}%` }}
                        transition={{ ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </Card>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Log display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <LogDisplay 
              currentLog={currentLog}
              showElapsedTime={showElapsedTime}
              currentElapsedTime={currentElapsedTime}
            />
          </motion.div>
          
          {/* Debug JSON viewers */}
          {(criteriJsonResponse || executiveSummaryJsonResponse) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Separator className="my-2" />
              <div className="flex flex-col gap-2">
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
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

FileUploader.displayName = "FileUploader";

export default FileUploader;