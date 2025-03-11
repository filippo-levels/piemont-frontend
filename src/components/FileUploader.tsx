import React, { useState, Dispatch, SetStateAction, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FileUploaderProps {
  setLogs: Dispatch<SetStateAction<string[]>>;
  setJsonResult: (data: any) => void;
  setElapsedTime: (time: number) => void;
  onRemove?: () => void;
}

const FileUploader = forwardRef<{ setFileFromExternal: (newFile: File) => void }, FileUploaderProps>(({ setLogs, setJsonResult, setElapsedTime, onRemove }, ref) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentLog, setCurrentLog] = useState<string>("");
  const [showElapsedTime, setShowElapsedTime] = useState(false);
  const [currentElapsedTime, setCurrentElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const updateElapsedTime = () => {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTimeRef.current) / 1000;
    setElapsedTime(elapsed);
    setCurrentElapsedTime(elapsed);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const logMessage = `📄 File selezionato: ${selectedFile.name}`;
      setCurrentLog(logMessage);
      setLogs((prev: string[]) => [...prev, logMessage]);
      setJsonResult(null);
      setElapsedTime(0);
      setCurrentElapsedTime(0);
      setShowElapsedTime(false);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      const logMessage = `📄 File selezionato: ${droppedFile.name}`;
      setCurrentLog(logMessage);
      setLogs((prev: string[]) => [...prev, logMessage]);
      setJsonResult(null);
      setElapsedTime(0);
      setCurrentElapsedTime(0);
      setShowElapsedTime(false);
      if (fileInputRef.current) {
        // Creare un nuovo DataTransfer per aggiornare l'input file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        fileInputRef.current.files = dataTransfer.files;
      }
    } else {
      const logMessage = "⚠️ Per favore, seleziona un file PDF valido";
      setCurrentLog(logMessage);
      setLogs((prev: string[]) => [...prev, logMessage]);
    }
  }, [setLogs, setJsonResult, setElapsedTime]);

  const handleAnalyze = async () => {
    if (!file) {
      const logMessage = "⚠️ Nessun file selezionato";
      setCurrentLog(logMessage);
      setLogs((prev: string[]) => [...prev, logMessage]);
      return;
    }
    setLoading(true);
    setElapsedTime(0);
    setCurrentElapsedTime(0);
    setShowElapsedTime(true);
    const logMessage = "⌛ Caricamento e analisi in corso...";
    setCurrentLog(logMessage);
    setLogs((prev: string[]) => [...prev, logMessage]);

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(updateElapsedTime, 100);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/full_analyze`,
        formData
      );

      // Estrai il criteria_tree dalla chiave "data" della risposta
      const data = response.data?.data;
      
      if (data) {
        setJsonResult(data);
        const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
        const completionMessage = `✅ Analisi completata con successo in ${timeElapsed.toFixed(2)} secondi.`;
        setCurrentLog(completionMessage);
        setLogs((prev: string[]) => [...prev, completionMessage]);
      } else {
        const errorMessage = "⚠️ Nessun dato restituito dall'API.";
        setCurrentLog(errorMessage);
        setLogs((prev: string[]) => [...prev, errorMessage]);
      }
      
    } catch (error: any) {
      const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
      const errorMessage = `❌ Errore: ${error.message}`;
      setCurrentLog(errorMessage);
      setLogs((prev: string[]) => [...prev, errorMessage]);
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setLoading(false);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const loadSelectedDisciplinare = async () => {
      const selectedDisciplinareData = localStorage.getItem('selectedDisciplinare');
      
      if (selectedDisciplinareData) {
        try {
          const fileData = JSON.parse(selectedDisciplinareData);
          const loadingMessage = `⌛ Caricamento del file ${fileData.filename} in corso...`;
          setCurrentLog(loadingMessage);
          setLogs((prev: string[]) => [...prev, loadingMessage]);
          
          // Scarica il file usando l'URL temporaneo
          const response = await fetch(fileData.url);
          
          if (!response.ok) {
            throw new Error(`Errore nel download del file: ${response.statusText}`);
          }
          
          // Converti la risposta in un blob
          const fileBlob = await response.blob();
          
          // Crea un oggetto File dal blob
          const fileObject = new File(
            [fileBlob], 
            fileData.filename, 
            { type: fileData.contentType || 'application/pdf' }
          );
          
          // Imposta il file nel componente
          setFile(fileObject);
          const loadedMessage = `📄 File caricato: ${fileData.filename}`;
          setCurrentLog(loadedMessage);
          setLogs((prev: string[]) => [...prev, loadedMessage]);
          
          // Aggiorna anche l'input file se necessario
          if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(fileObject);
            fileInputRef.current.files = dataTransfer.files;
          }
          
          // Pulisci il localStorage
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

  // Esponi la funzione setFile
  useImperativeHandle(ref, () => ({
    setFileFromExternal: (newFile: File) => {
      setFile(newFile);
      const logMessage = `📄 File selezionato: ${newFile.name}`;
      setCurrentLog(logMessage);
      setLogs((prev: string[]) => [...prev, logMessage]);
      setJsonResult(null);
      setElapsedTime(0);
      setCurrentElapsedTime(0);
      setShowElapsedTime(false);
      
      // Aggiorna anche l'input file se necessario
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(newFile);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  }));

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col gap-4">
        <div 
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group flex flex-col items-center justify-center p-6 rounded-lg
            border-2 border-dashed transition-all duration-300 cursor-pointer
            ${isDragging 
              ? "border-[#3dcab1] bg-[#3dcab1]/10" 
              : file 
                ? "border-[#3dcab1] bg-[#3dcab1]/5" 
                : "border-gray-300 hover:border-[#3dcab1] hover:bg-gray-50"
            }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-row items-center gap-4 w-full justify-center">
            <svg 
              className={`w-12 h-12 ${isDragging ? "text-[#3dcab1]" : "text-gray-400"}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            
            {file ? (
              <div className="flex flex-col">
                <p className="text-lg font-medium text-[#3dcab1]">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <p className="text-lg font-medium text-gray-700">
                  {isDragging ? "Rilascia qui il file" : "Trascina qui il tuo PDF"}
                </p>
                <p className="text-sm text-gray-500">oppure clicca per selezionare (solo file PDF)</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-row justify-center">
          <button 
            onClick={handleAnalyze} 
            disabled={loading || !file}
            className="w-48 px-6 py-2 bg-[#3dcab1] text-[#fefefe] rounded-lg
              disabled:opacity-50 hover:bg-[#3dcab1]/90 
              transition-all duration-200 font-medium shadow-sm
              hover:shadow-md disabled:hover:shadow-none
              flex items-center justify-center gap-2"
          >
            {loading ? (
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
                Analisi in corso...
              </>
            ) :
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19.5V14m6 5.5V14"
                  />
                </svg>
                Carica & Analizza
              </>
            }
          </button>
        </div>
        
        {/* Log display section */}
        {currentLog && (
          <div className="mt-2 p-3 bg-gray-50 border rounded-lg text-sm text-gray-600">
            <div className="flex justify-between items-center">
              {currentLog}
              {showElapsedTime && currentElapsedTime > 0 && (
                <div className="px-2 py-1 bg-[#3dcab1]/10 text-[#3dcab1] rounded-md text-xs font-medium ml-2">
                  {currentElapsedTime.toFixed(2)}s
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

FileUploader.displayName = "FileUploader";

export default FileUploader;