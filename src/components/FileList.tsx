"use client";
import { useState, useEffect } from 'react';

interface FileListProps {
  onError?: (error: string) => void;
}

export default function FileList({ onError }: FileListProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiles, setFilteredFiles] = useState<string[]>([]);

  // Caricamento automatico all'apertura
  useEffect(() => {
    fetchFiles();
  }, []);

  // Gestione della ricerca intelligente
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFiles(files);
      return;
    }

    const searchWords = searchTerm.toLowerCase().split(' ');
    const filtered = files.filter(file => {
      const fileName = file.toLowerCase();
      return searchWords.every(word => fileName.includes(word));
    });
    
    setFilteredFiles(filtered);
  }, [searchTerm, files]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/list_files_disciplinari');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      if (onError) {
        onError('Errore durante il recupero dei file');
      }
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (fileName: string) => {
    // Qui puoi implementare la logica per caricare il file
    console.log(`Caricamento del file: ${fileName}`);
    // Esempio di funzione da implementare
    // uploadFile(fileName);
  };



  const handleView = (fileName: string) => {
    // Qui puoi implementare la logica per visualizzare il file
    console.log(`Visualizzazione del file: ${fileName}`);
    window.open(`http://localhost:8000/api/view_file/${fileName}`, '_blank');
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          File disponibili ({filteredFiles.length})
        </h2>
        <button
          onClick={fetchFiles}
          className="px-4 py-2 bg-[#3dcab1] text-white rounded-lg hover:bg-[#3dcab1]/90 transition-colors flex items-center space-x-2"
          disabled={loading}
        >
          <svg 
            className="h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          {loading ? 'Caricamento...' : 'Aggiorna'}
        </button>
      </div>

      {/* Campo di ricerca */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cerca file..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3dcab1] focus:border-transparent"
        />
        <svg
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      {/* Lista dei file filtrata */}
      {filteredFiles.length > 0 ? (
        <div className="max-h-[250px] overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {filteredFiles.map((file, index) => (
              <li key={index} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  <div className="text-gray-700 overflow-x-auto whitespace-nowrap max-w-[200px] hover:max-w-full transition-all duration-300">
                    {file}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(file)}
                    className="text-xs px-2 py-1 bg-[#3dcab1] text-white rounded hover:bg-[#3dcab1]/90 transition-colors flex items-center space-x-1"
                    title="Visualizza questo file"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Visualizza</span>
                  </button>
                  <button
                    onClick={() => handleUpload(file)}
                    className="text-xs px-2 py-1 bg-[#101010] text-white rounded hover:bg-[#101010]/90 transition-colors flex items-center space-x-1"
                    title="Carica questo file"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                    <span>Carica</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          {loading ? 'Caricamento file...' : searchTerm ? 'Nessun file trovato' : 'Nessun file disponibile'}
        </p>
      )}
    </div>
  );
}