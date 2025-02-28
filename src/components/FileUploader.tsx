import React, { useState, Dispatch, SetStateAction, useRef } from "react";
import axios from "axios";

interface FileUploaderProps {
  setLogs: Dispatch<SetStateAction<string[]>>;
  setJsonResult: (data: any) => void;
  setElapsedTime: (time: number) => void;
}

export default function FileUploader({ setLogs, setJsonResult, setElapsedTime }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="relative group">
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange}
            className="w-full file:mr-4 file:py-3 file:px-6 
              file:rounded-lg file:border-0
              file:text-[#101010] file:bg-[#3dcab1]/10
              hover:file:bg-[#3dcab1]/20
              file:cursor-pointer file:font-medium
              file:transition-all file:duration-200
              text-[#101010] rounded-lg
              border-2 border-dashed border-gray-300
              hover:border-[#3dcab1] transition-all duration-200
              focus:outline-none focus:border-[#3dcab1]" 
          />
        </div>
        <div className="flex justify-center gap-4">
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
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
              "Carica & Analizza"
            )}
          </button>
          <button 
            onClick={handleRemove}
            className="w-48 px-6 py-3 bg-[#101010] text-[#fefefe] rounded-lg
              hover:bg-[#101010]/90 transition-all duration-200
              font-medium shadow-sm hover:shadow-md"
          >
            Rimuovi
          </button>
        </div>
      </div>
    </div>
  );
}