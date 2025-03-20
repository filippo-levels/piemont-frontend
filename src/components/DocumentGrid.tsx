"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, File } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  viewMode = 'grid'
}, ref) => {
  const [documents, setDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState<string[]>([]);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/list_files_disciplinari`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
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

  // Funzione per ottenere l'icona appropriata in base all'estensione del file
  const getDocumentIcon = (fileName: string, size: number = 24) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FileText size={size} className="text-primary" />;
    }
    return <File size={size} className="text-primary" />;
  };

  // Renderizza la visualizzazione a griglia
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {filteredDocuments.map((doc, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden border-none"
            onClick={() => onDocumentClick && onDocumentClick(doc)}
          >
            <CardContent className="p-0">
              <div className="flex flex-col items-center justify-center bg-muted p-6">
                {getDocumentIcon(doc, smallerIcons ? 40 : 48)}
                <Separator className="my-3 w-1/2 bg-primary/20" />
                <div className="text-sm font-medium text-center mt-2 px-2 truncate w-full">
                  {doc.length > 20 ? doc.substring(0, 20) + '...' : doc}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Renderizza la visualizzazione a elenco
  const renderListView = () => {
    return (
      <div className="space-y-2 mt-4">
        {filteredDocuments.map((doc, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:bg-muted/30 transition-colors border-none"
            onClick={() => onDocumentClick && onDocumentClick(doc)}
          >
            <CardContent className="p-3 flex items-center gap-4">
              <div className="bg-muted p-3 rounded flex items-center justify-center">
                {getDocumentIcon(doc, 24)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{doc}</h3>
                <p className="text-sm text-muted-foreground">Disciplinare</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center my-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-primary/20 mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
      ) : (
        <>
          {!hideTitle && (
            <h2 className="text-xl font-medium mb-4">I tuoi disciplinari</h2>
          )}
          
          {filteredDocuments.length === 0 ? (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <div className="text-muted-foreground font-medium">
                Nessun documento trovato.
              </div>
            </div>
          ) : (
            viewMode === 'grid' ? renderGridView() : renderListView()
          )}
        </>
      )}
    </div>
  );
});

DocumentGrid.displayName = 'DocumentGrid';

export default DocumentGrid; 