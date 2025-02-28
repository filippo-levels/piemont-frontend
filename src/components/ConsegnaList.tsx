"use client";
import { useState, useEffect } from 'react';
import { Folder, File, Home, ChevronRight, Eye, Download, ArrowLeft } from 'lucide-react';

interface ConsegnaListProps {
  onError?: (error: string) => void;
}

export default function ConsegnaList({ onError }: ConsegnaListProps) {
  const [folders, setFolders] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Al primo render, carichiamo la "root" di consegna (prefix vuoto)
    fetchConsegnaContent('');
  }, []);

  /**
   * Funzione per chiamare il backend e ottenere folders e files
   */
  const fetchConsegnaContent = async (prefix: string) => {
    try {
      setLoading(true);

      // Costruiamo la URL con o senza query param 'prefix'
      const url = prefix
        ? `http://localhost:8000/api/list_consegna?prefix=${encodeURIComponent(prefix)}`
        : `http://localhost:8000/api/list_consegna`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch S3 contents');
      const data = await response.json();

      // Salviamo nello stato le cartelle e i file
      setFolders(data.folders || []);
      setFiles(data.files || []);
      setCurrentPrefix(prefix);
      
      // Aggiorna breadcrumbs
      if (prefix === '') {
        setBreadcrumbs([]);
      } else {
        setBreadcrumbs(prefix.split('/'));
      }
    } catch (error) {
      console.error('Error fetching S3 content:', error);
      if (onError) onError('Errore durante il recupero dei dati da S3');
      setFolders([]);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Quando clicchiamo su una cartella
   */
  const navigateToFolder = (folderName: string) => {
    const newPrefix = currentPrefix ? `${currentPrefix}/${folderName}` : folderName;
    fetchConsegnaContent(newPrefix);
  };

  /**
   * Reset alla root (prefix vuoto)
   */
  const resetToRoot = () => {
    fetchConsegnaContent('');
  };

  /**
   * Navigazione tramite breadcrumb
   */
  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      resetToRoot();
      return;
    }
    
    const newPrefix = breadcrumbs.slice(0, index + 1).join('/');
    fetchConsegnaContent(newPrefix);
  };

  /**
   * Navigazione verso la cartella superiore
   */
  const navigateUp = () => {
    if (breadcrumbs.length === 0) return;
    
    if (breadcrumbs.length === 1) {
      resetToRoot();
    } else {
      const newPrefix = breadcrumbs.slice(0, breadcrumbs.length - 1).join('/');
      fetchConsegnaContent(newPrefix);
    }
  };

  /**
   * Apri file PDF in una nuova scheda
   */
  const openFile = (fileName: string) => {
    // Per i file in consegna_prefix, dobbiamo specificare il percorso completo
    // Costruiamo il percorso completo includendo il prefix corrente
    const prefix = "disciplinari_consegna" + (currentPrefix ? '/' + currentPrefix : '');
    
    // Apri il file con il corretto prefisso usando il parametro query
    const url = `http://localhost:8000/api/view_file/${encodeURIComponent(fileName)}?prefix=${encodeURIComponent(prefix)}`;
    window.open(url, '_blank');
  };

  const isPDF = (fileName: string) => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  const getFileIcon = (fileName: string) => {
    if (isPDF(fileName)) return <File className="text-red-500" size={20} />;
    return <File className="text-blue-500" size={20} />;
  };

  // Filtra cartelle e file in base al termine di ricerca
  const filteredFolders = folders.filter(folder => 
    folder.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredFiles = files.filter(file => 
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header con titolo, conteggio cartelle e barra di ricerca */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Lista di Consegne</h2>
            <p className="text-sm text-gray-500">{folders.length} cartelle disponibili</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <input
                type="text"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#3dcab1]"
              />
            </div>
            
            {currentPrefix && (
              <button 
                onClick={navigateUp}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors text-sm"
              >
                <ArrowLeft size={14} />
                <span>Indietro</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="flex items-center text-xs mt-2 overflow-x-auto">
          <button 
            onClick={resetToRoot}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Home size={14} />
            <span className="ml-1">Home</span>
          </button>
          
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-400" />
              <button 
                onClick={() => navigateToBreadcrumb(index)}
                className="text-blue-600 hover:text-blue-800 truncate max-w-xs"
              >
                {crumb}
              </button>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32 p-4">
          <div className="animate-pulse text-gray-500 text-sm">Caricamento...</div>
        </div>
      ) : (
        <div className="p-4">
          {/* Sezione combinata per cartelle e file */}
          <div className="overflow-y-auto pr-2" style={{ maxHeight: '500px' }}>
            {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
              <p className="text-gray-500 italic text-sm">Nessun elemento trovato</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* Prima mostriamo le cartelle */}
                {filteredFolders.map((folder, index) => (
                  <div
                    key={`folder-${index}`}
                    onClick={() => navigateToFolder(folder)}
                    className="flex items-center p-2 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Folder className="text-yellow-500 mr-2 flex-shrink-0" size={20} />
                    <span className="truncate text-sm flex-grow" title={folder}>{folder}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3dcab1]"></div>
                  </div>
                ))}
                
                {/* Poi mostriamo i file */}
                {filteredFiles.map((file, index) => (
                  <div
                    key={`file-${index}`}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {getFileIcon(file)}
                      <span className="truncate text-sm" title={file}>{file}</span>
                    </div>
                    
                    {isPDF(file) && (
                      <button
                        onClick={() => openFile(file)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-[#3dcab1] text-white rounded hover:bg-[#33ab97] transition-colors ml-2"
                        title="Visualizza PDF"
                      >
                        <Eye size={14} />
                        <span>Visualizza</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}