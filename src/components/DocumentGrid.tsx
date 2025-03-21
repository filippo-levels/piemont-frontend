"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
interface DocumentGridProps {
  onError?: (error: string) => void;
  onDocumentClick?: (fileName: string) => void;
  showNewButton?: boolean;
  hideTitle?: boolean;
  smallerIcons?: boolean;
  viewMode?: 'grid' | 'list';
}

const DocumentGrid = forwardRef<{ fetchDocuments: () => Promise<void> }, DocumentGridProps>(({ 
  onError, 
  onDocumentClick, 
  showNewButton = true,
  hideTitle = false,
  smallerIcons = false,
  viewMode: propViewMode = 'grid'
}, ref) => {
  const [documents, setDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(propViewMode);

  // Rileva se il dispositivo è mobile e imposta la visualizzazione di conseguenza
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      
      // Se è mobile, forza sempre la visualizzazione a lista
      if (mobile) {
        setViewMode('list');
      } else {
        setViewMode(propViewMode);
      }
    };
    
    // Controlla all'avvio
    checkIfMobile();
    
    // Aggiungi listener per il resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [propViewMode]);

  // Espone la funzione fetchDocuments al componente padre
  useImperativeHandle(ref, () => ({
    fetchDocuments
  }));

  // Caricamento automatico all'apertura
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Gestione della ricerca intelligente
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDocuments(documents);
      return;
    }

    const searchWords = searchTerm.toLowerCase().split(' ');
    const filtered = documents.filter(doc => {
      const docName = doc.toLowerCase();
      return searchWords.every(word => docName.includes(word));
    });
    
    setFilteredDocuments(filtered);
  }, [searchTerm, documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/list_files_disciplinari`, {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY
        }
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch documents');
      }
      const data = response.data;
      setDocuments(data.files);
    } catch (error) {
      if (onError) {
        onError('Errore durante il recupero dei documenti');
      }
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per generare un colore casuale ma consistente per ogni documento
  const getDocumentColor = (fileName: string) => {
    // Utilizziamo una palette di colori più coerente con gradazioni simili
    // Palette di blu-verdi con diverse intensità
    const colors = [
      'bg-teal-600', 'bg-teal-700', 'bg-teal-800',
      'bg-cyan-600', 'bg-cyan-700', 'bg-cyan-800',
      'bg-blue-600', 'bg-blue-700', 'bg-blue-800',
      'bg-sky-600', 'bg-sky-700', 'bg-sky-800',
    ];
    
    // Usa la somma dei codici ASCII delle lettere nel nome del file come indice
    const sum = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  // Funzione per ottenere l'icona appropriata in base all'estensione del file
  const getDocumentIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return (
        <svg className={`${smallerIcons ? 'h-6 w-6' : 'h-8 w-8'} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 16H8V8h4v8zm2 0V8h4v8h-4zm6-12H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
        </svg>
      );
    }
    
    return (
      <svg className={`${smallerIcons ? 'h-6 w-6' : 'h-8 w-8'} text-white`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z"/>
      </svg>
    );
  };

  // Renderizza la visualizzazione a griglia
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {filteredDocuments.map((doc, index) => {
          const docColor = getDocumentColor(doc);
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => onDocumentClick && onDocumentClick(doc)}
            >
              <div className={`${docColor} p-4 flex items-center justify-center ${smallerIcons ? 'aspect-[4/3]' : 'aspect-square'}`}>
                <div className="flex flex-col items-center">
                  {getDocumentIcon(doc)}
                  <div className="mt-3 text-white font-medium text-center truncate max-w-full px-2 text-sm">
                    {doc.length > 20 ? doc.substring(0, 20) + '...' : doc}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizza la visualizzazione a elenco
  const renderListView = () => {
    return (
      <div className="space-y-2 mt-4">
        {filteredDocuments.map((doc, index) => {
          const docColor = getDocumentColor(doc);
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onDocumentClick && onDocumentClick(doc)}
            >
              <div className="flex items-center p-3">
                <div className={`${docColor} p-3 rounded-lg mr-4 flex items-center justify-center`}>
                  {getDocumentIcon(doc)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{doc}</h3>
                  <p className="text-sm text-gray-500">Disciplinare</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {!hideTitle && (
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              I tuoi disciplinari ({filteredDocuments.length})
            </h2>
            <div className="flex items-center space-x-2">
              {/* Mostra i pulsanti di cambio vista solo su desktop */}
              {!isMobile && (
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Vista griglia"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 5v5h5V5H4zm11 0v5h5V5h-5zM4 16v5h5v-5H4zm11 0v5h5v-5h-5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Vista elenco"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Pulsante aggiorna */}
              <button
                onClick={fetchDocuments}
                className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center space-x-1"
                disabled={loading}
                title="Aggiorna"
              >
                <svg 
                  className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} 
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
                <span className={isMobile ? "block" : "hidden"}>Aggiorna</span>
              </button>
            </div>
          </div>
        )}

        {/* Campo di ricerca */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca disciplinari..."
            className="w-full px-8 py-2.5 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3dcab1] focus:border-transparent"
          />
          <svg
            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
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
        
        {/* Visualizzazione dei documenti */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredDocuments.length > 0 ? (
            viewMode === 'grid' && !isMobile ? renderGridView() : renderListView()
          ) : (
            <div className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
              {loading ? 'Caricamento disciplinari...' : searchTerm ? 'Nessun disciplinare trovato' : 'Nessun disciplinare disponibile'}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottone di upload fuori dall'elenco */}
      {showNewButton && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              // Implementazione dell'upload o navigazione a pagina di upload
              if (onDocumentClick) onDocumentClick("new");
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#3dcab1] text-white rounded-lg shadow-md hover:bg-[#3dcab1]/90 transition-all"
            aria-label="Carica nuovo disciplinare"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Carica nuovo disciplinare</span>
          </button>
        </div>
      )}
    </>
  );
});

export default DocumentGrid; 