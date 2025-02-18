import React, { useState } from "react";
import axios from "axios";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
  setJsonResult: (data: any) => void;
}

export default function FileUploader({ setLogs, setJsonResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLogs(["File selezionato: " + selectedFile.name]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setLogs(["Nessun file selezionato"]);
      return;
    }
  
    setUploading(true);
    setLogs(prev => [...prev, "Caricamento in corso..."]);
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload_pdf`,
          formData
        );
        
        const { data, logs } = response.data; 
      
        // Aggiorna i log
        setLogs(prev => [...prev, ...(logs || [])]);
      
        // Aggiorna il JSON
        setJsonResult(data);
      
        // Aggiungi un messaggio di completamento
        setLogs(prev => [...prev, "Upload completato con successo!"]);
      
      } catch (error: any) {
        setLogs(prev => [
          ...prev,
          `Errore: ${error.message}`,
        ]);
      } finally {
        setUploading(false);
      }
  };
  
  const removeFile = () => {
    setFile(null);
    setLogs([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-lg font-semibold mb-2">Carica il tuo disciplinare</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Trascina il file qui, o clicca per selezionarlo
          </p>
          <p className="text-xs text-muted-foreground">
            Formato supportato: PDF (max 10MB)
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full max-w-xs cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            id="file-input"
          />
        </div>
      </div>

      {file && (
        <div className="mt-6">
          <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-background flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                size="sm"
                className="bg-blue-500 hover:bg-blue-700"
              >
                {uploading ? "Analisi..." : "Avvia Analisi"}
              </Button>
              <Button size="icon" variant="ghost" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
