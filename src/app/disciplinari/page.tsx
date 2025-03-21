"use client";
import { useState, useEffect, useRef } from "react";
import DocumentGrid from "@/components/DocumentGrid";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Upload, List, Grid } from "lucide-react";
import { motion } from "framer-motion";

export default function DisciplinariPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalDocuments: 0
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const documentGridRef = useRef<any>(null);
  const router = useRouter();

  // Funzione per caricare le statistiche
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Puoi sostituire questa chiamata con l'endpoint effettivo per le statistiche
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/list_files_disciplinari`);
      
      if (response.data && response.data.files) {
        // Calcola statistiche di base dai file disponibili
        const totalDocs = response.data.files.length;
        
        setStats({
          totalDocuments: totalDocs
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per aggiornare sia le statistiche che la lista dei documenti
  const handleRefresh = async () => {
    await fetchStats();
    if (documentGridRef.current && documentGridRef.current.fetchDocuments) {
      await documentGridRef.current.fetchDocuments();
    }
  };

  // Funzione per gestire il click su un documento
  const handleDocumentClick = (fileName: string) => {
    // Naviga alla pagina del documento con il nome del file come parametro
    router.push(`/document/${encodeURIComponent(fileName)}`);
  };

  // Funzione per gestire il click sul pulsante "NUOVO"
  const handleNewDocument = () => {
    router.push('/upload');
  };

  // Funzione per cambiare la modalità di visualizzazione
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };
  
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header animato con motion */}
        <motion.div
          className="text-center py-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">
            I tuoi disciplinari
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Gestisci, visualizza e analizza tutti i tuoi documenti in un unico posto.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Document Grid con pulsante NUOVO */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-normal">I tuoi disciplinari</CardTitle>
              <Badge variant="outline" className="text-primary border-primary">
                {loading ? '...' : stats.totalDocuments} totali
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end items-center gap-3 mb-6">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">{loading ? 'Caricamento...' : 'Aggiorna'}</span>
                </Button>
                <Button
                  onClick={toggleViewMode}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {viewMode === 'grid' ? (
                    <>
                      <List className="h-4 w-4" />
                      <span className="hidden sm:inline">Elenco</span>
                    </>
                  ) : (
                    <>
                      <Grid className="h-4 w-4" />
                      <span className="hidden sm:inline">Griglia</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleNewDocument}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4 text-white" />
                  Upload
                </Button>
              </div>
              <DocumentGrid 
                ref={documentGridRef}
                onError={(error) => setLogs(prev => [...prev, error])}
                onDocumentClick={handleDocumentClick}
                showNewButton={false}
                hideTitle={true}
                smallerIcons={true}
                viewMode={viewMode}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 