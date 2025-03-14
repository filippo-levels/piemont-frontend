"use client";
import { useState, useEffect } from 'react';
import { Folder, File, Home, ChevronRight, Eye, Download, ArrowLeft, Search } from 'lucide-react';

interface ConsegnaListProps {
  onError?: (error: string) => void;
  initialSearchTerm?: string;
  singleColumn?: boolean;
}

export default function ConsegnaList({ onError, initialSearchTerm = '', singleColumn = false }: ConsegnaListProps) {
  const [folders, setFolders] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    // Al primo render, carichiamo la "root" di consegna (prefix vuoto)
    fetchConsegnaContent('');
  }, []);

  // Aggiorniamo il termine di ricerca quando cambia initialSearchTerm
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

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
      if (prefix) {
        const parts = prefix.split('/').filter(Boolean);
        setBreadcrumbs(parts);
      } else {
        setBreadcrumbs([]);
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
    const newPrefix = currentPrefix 
      ? `${currentPrefix}${folderName}/` 
      : `${folderName}/`;
    
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
    // Ricostruiamo il prefix fino all'indice selezionato
    const selectedParts = breadcrumbs.slice(0, index + 1);
    const newPrefix = selectedParts.join('/') + '/';
    
    fetchConsegnaContent(newPrefix);
  };

  /**
   * Navigazione verso la cartella superiore
   */
  const navigateUp = () => {
    if (breadcrumbs.length === 0) {
      // Se siamo già alla root, non facciamo nulla
      return;
    }
    
    // Rimuoviamo l'ultimo elemento dai breadcrumbs
    const newBreadcrumbs = breadcrumbs.slice(0, -1);
    const newPrefix = newBreadcrumbs.length > 0 
      ? newBreadcrumbs.join('/') + '/' 
      : '';
    
    fetchConsegnaContent(newPrefix);
  };

  /**
   * Apri file PDF in una nuova scheda
   */
  const openFile = (fileName: string) => {
    const fullPath = currentPrefix + fileName;
    window.open(`http://localhost:8000/api/view_consegna/${encodeURIComponent(fullPath)}`, '_blank');
  };

  const isPDF = (fileName: string) => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  const getFileIcon = (fileName: string) => {
    if (isPDF(fileName)) {
      return <File className="text-red-500 flex-shrink-0" size={18} />;
    }
    return <File className="text-gray-500 flex-shrink-0" size={18} />;
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
      <div className="p-3 sm:p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Lista di Consegne</h2>
            <p className="text-xs sm:text-sm text-gray-500">{folders.length} cartelle disponibili</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <input
                type="text"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#3dcab1]"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            </div>
            
            {currentPrefix && (
              <button 
                onClick={navigateUp}
                className="flex items-center justify-center gap-1 px-3 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors text-xs sm:text-sm"
              >
                <ArrowLeft size={14} className="flex-shrink-0" />
                <span>Indietro</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="flex items-center text-xs mt-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <button 
            onClick={resetToRoot}
            className="flex items-center text-blue-600 hover:text-blue-800 flex-shrink-0"
          >
            <Home size={12} className="flex-shrink-0" />
            <span className="ml-1">Home</span>
          </button>
          
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <ChevronRight size={10} className="mx-1 text-gray-400 flex-shrink-0" />
              <button 
                onClick={() => navigateToBreadcrumb(index)}
                className="text-blue-600 hover:text-blue-800 truncate max-w-[100px] sm:max-w-[150px] md:max-w-xs"
              >
                {crumb}
              </button>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-24 sm:h-32 p-4">
          <div className="animate-pulse text-gray-500 text-xs sm:text-sm">Caricamento...</div>
        </div>
      ) : (
        <div className="p-2 sm:p-4">
          {/* Sezione combinata per cartelle e file */}
          {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
            <div className="flex justify-center items-center h-24 sm:h-32">
              <p className="text-gray-500 italic text-xs sm:text-sm">Nessun elemento trovato</p>
            </div>
          ) : (
            <div className="overflow-y-auto pr-1 sm:pr-2" style={{ maxHeight: '350px', scrollbarWidth: 'thin' }}>
              <div className={`grid ${singleColumn ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-1.5 sm:gap-2`}>
                {/* Prima mostriamo le cartelle */}
                {filteredFolders.map((folder, index) => (
                  <div
                    key={`folder-${index}`}
                    onClick={() => navigateToFolder(folder)}
                    className="flex items-center p-1.5 sm:p-2 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Folder className="text-yellow-500 mr-1.5 sm:mr-2 flex-shrink-0" size={16} />
                    <span className="truncate text-xs sm:text-sm flex-grow" title={folder}>{folder}</span>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#3dcab1] flex-shrink-0"></div>
                  </div>
                ))}
                
                {/* Poi mostriamo i file */}
                {filteredFiles.map((file, index) => (
                  <div
                    key={`file-${index}`}
                    className="flex items-center p-1.5 sm:p-2 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => isPDF(file) && openFile(file)}
                  >
                    <div className="flex items-center space-x-1.5 sm:space-x-2 truncate flex-grow min-w-0">
                      {getFileIcon(file)}
                      <span className={`truncate text-xs sm:text-sm ${isPDF(file) ? 'text-blue-600 hover:underline' : ''}`} title={file}>
                        {file}
                      </span>
                    </div>
                    
                    {!isPDF(file) && (
                      <span className="text-[10px] sm:text-xs text-gray-500 italic ml-1 flex-shrink-0">Non visualizzabile</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}