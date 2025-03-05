import React, { useState, Dispatch, SetStateAction, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FileUploaderProps {
  setLogs: Dispatch<SetStateAction<string[]>>;
  setJsonResult: (data: any) => void;
  setElapsedTime: (time: number) => void;
}

const FileUploader = forwardRef<{ setFileFromExternal: (newFile: File) => void }, FileUploaderProps>(({ setLogs, setJsonResult, setElapsedTime }, ref) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const updateElapsedTime = () => {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTimeRef.current) / 1000;
    setElapsedTime(elapsed);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLogs((prev: string[]) => [...prev, `📄 File selezionato: ${selectedFile.name}`]);
      setJsonResult(null);
      setElapsedTime(0);
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
      setLogs((prev: string[]) => [...prev, `📄 File selezionato: ${droppedFile.name}`]);
      setJsonResult(null);
      setElapsedTime(0);
      if (fileInputRef.current) {
        // Creare un nuovo DataTransfer per aggiornare l'input file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        fileInputRef.current.files = dataTransfer.files;
      }
    } else {
      setLogs((prev: string[]) => [...prev, "⚠️ Per favore, seleziona un file PDF valido"]);
    }
  }, [setLogs, setJsonResult, setElapsedTime]);

  const handleAnalyze = async () => {
    if (!file) {
          setLogs((prev: string[]) => [...prev, "⚠️ Nessun file selezionato"]);
          return;
      }
      setLoading(true);
      setElapsedTime(0);
      setLogs((prev: string[]) => [...prev, "⌛ Caricamento e analisi in corso..."]);

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
              setLogs((prev: string[]) => [
                  ...prev, 
                  `✅ Analisi completata con successo in ${timeElapsed.toFixed(2)} secondi.`,
              ]);
          } else {
              setLogs((prev: string[]) => [...prev, "⚠️ Nessun dato restituito dall'API."]);
          }
          
      } catch (error: any) {
          const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
          setLogs((prev: string[]) => [...prev, `❌ Errore: ${error.message}`]);
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
    setLogs((prev: string[]) => [...prev, "🗑️ File rimosso"]);
    setJsonResult(null);
    setElapsedTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const navigateToDisciplinari = () => {
    // Naviga alla sezione dei disciplinari
    router.push('/?tab=gestionale');
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
          setLogs((prev: string[]) => [...prev, `⌛ Caricamento del file ${fileData.filename} in corso...`]);
          
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
          setLogs((prev: string[]) => [...prev, `📄 File caricato: ${fileData.filename}`]);
          
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
          setLogs((prev: string[]) => [...prev, `❌ Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`]);
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
      setLogs((prev: string[]) => [...prev, `📄 File selezionato: ${newFile.name}`]);
      setJsonResult(null);
      setElapsedTime(0);
      
      // Aggiorna anche l'input file se necessario
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(newFile);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  }));

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex flex-col gap-6">
        <div 
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group flex flex-col items-center justify-center p-10 rounded-lg
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
          
          <div className="flex flex-col items-center text-center">
            <svg 
              className={`w-16 h-16 mb-4 ${isDragging ? "text-[#3dcab1]" : "text-gray-400"}`} 
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
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium text-[#3dcab1]">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-700">
                  {isDragging ? "Rilascia qui il file" : "Trascina qui il tuo PDF"}
                </p>
                <p className="text-sm text-gray-500 mt-1">oppure clicca per selezionare</p>
                <p className="text-xs text-gray-400 mt-2">Solo file PDF</p>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-row justify-center gap-4">
          <button 
            onClick={handleAnalyze} 
            disabled={loading || !file}
            className="w-48 px-6 py-3 bg-[#3dcab1] text-[#fefefe] rounded-lg
              disabled:opacity-50 hover:bg-[#3dcab1]/90 
              transition-all duration-200 font-medium shadow-sm
              hover:shadow-md disabled:hover:shadow-none
              flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                In corso...
              </>
            ) : (
              <>
                <svg 
                  className="h-5 w-5" 
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
            )}
          </button>
          <button 
            onClick={handleRemove}
            disabled={!file}
            className="w-48 px-6 py-3 bg-[#101010] text-[#fefefe] rounded-lg
              disabled:opacity-50 hover:bg-[#101010]/90 transition-all duration-200
              font-medium shadow-sm hover:shadow-md disabled:hover:shadow-none
              flex items-center justify-center gap-2"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Rimuovi
          </button>
          <button 
            onClick={navigateToDisciplinari}
            className="w-48 px-6 py-3 bg-[#4a5568] text-[#fefefe] rounded-lg
              hover:bg-[#4a5568]/90 transition-all duration-200
              font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <svg 
              className="h-5 w-5" 
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
            Disciplinari
          </button>
        </div>
      </div>
    </div>
  );
});

export default FileUploader;