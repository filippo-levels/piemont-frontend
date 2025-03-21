"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/app/upload/FileUploader";
import CriteriSimiliViewer from "@/app/upload/CriteriSimiliViewer";
import ExecutiveSummary from "@/app/upload/ExecutiveSummary";
import { generatePDF } from "../../utils/pdfGenerator";
import { clearAllJsonDebugData } from "./components/JsonDebugViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trash2, Download, FileText, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = 'uploadAnalysisResult';
const EXECUTIVE_SUMMARY_KEY = 'executiveSummaryResult';

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function UploadPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [executiveSummary, setExecutiveSummary] = useState<any>(null);
  const [activeView, setActiveView] = useState<'criteri' | 'executive' | null>(null);
  const router = useRouter();
  const fileUploaderRef = useRef(null);

  // Carica i risultati dal localStorage all'avvio
  useEffect(() => {
    // Carica i criteri estratti
    const savedResult = localStorage.getItem(STORAGE_KEY);
    if (savedResult) {
      try {
        setJsonResult(JSON.parse(savedResult));
        setActiveView('criteri');
      } catch (error) {
        console.error('Errore nel parsing dei dati salvati:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    // Carica l'executive summary
    const savedSummary = localStorage.getItem(EXECUTIVE_SUMMARY_KEY);
    if (savedSummary) {
      try {
        setExecutiveSummary(JSON.parse(savedSummary));
        // Se non ci sono criteri estratti, mostra l'executive summary
        if (!savedResult) {
          setActiveView('executive');
        }
      } catch (error) {
        console.error('Errore nel parsing dell\'executive summary salvato:', error);
        localStorage.removeItem(EXECUTIVE_SUMMARY_KEY);
      }
    }
  }, []);

  // Salva i risultati nel localStorage quando cambiano
  useEffect(() => {
    if (jsonResult) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonResult));
      setActiveView('criteri');
    }
  }, [jsonResult]);

  // Salva l'executive summary nel localStorage quando cambia
  useEffect(() => {
    if (executiveSummary) {
      localStorage.setItem(EXECUTIVE_SUMMARY_KEY, JSON.stringify(executiveSummary));
      setActiveView('executive');
    }
  }, [executiveSummary]);

  const handleBack = () => {
    router.push('/');
  };

  const handleRemoveAnalysis = () => {
    // Rimuovi tutti i dati dal localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXECUTIVE_SUMMARY_KEY);
    clearAllJsonDebugData();
    
    // Resetta lo stato
    setJsonResult(null);
    setExecutiveSummary(null);
    setLogs([]);
    setElapsedTime(0);
    setActiveView(null);
    
    // Ricarica la pagina per assicurarsi che tutto sia correttamente resettato
    window.location.reload();
  };

  const handleExportToPDF = () => {
    if (jsonResult) {
      generatePDF([jsonResult], executiveSummary);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-normal">
                Analizza un disciplinare di gara
              </CardTitle>
              <div className="flex gap-3">
                {(jsonResult || executiveSummary) && (
                  <Button
                    onClick={handleRemoveAnalysis}
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Rimuovi
                  </Button>
                )}
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <FileUploader 
                ref={fileUploaderRef}
                setLogs={setLogs} 
                setJsonResult={setJsonResult} 
                setElapsedTime={setElapsedTime}
                setExecutiveSummary={setExecutiveSummary}
                onRemove={handleRemoveAnalysis}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {(jsonResult || executiveSummary) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-normal">
                    Risultati dell'analisi
                  </CardTitle>
                  <Button
                    onClick={handleExportToPDF}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Esporta PDF
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs 
                    defaultValue={activeView || 'criteri'} 
                    value={activeView || 'criteri'}
                    onValueChange={(value) => setActiveView(value as 'criteri' | 'executive')}
                    className="w-full"
                  >
                    <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 rounded-xl overflow-hidden p-1 bg-gray-100">
                      <TabsTrigger 
                        value="criteri" 
                        disabled={!jsonResult}
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center gap-2 py-2.5"
                      >
                        <FileText className="h-4 w-4" />
                        Criteri Estratti
                      </TabsTrigger>
                      <TabsTrigger 
                        value="executive" 
                        disabled={!executiveSummary}
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:font-medium flex items-center gap-2 py-2.5"
                      >
                        <BarChart2 className="h-4 w-4" />
                        Executive Summary
                      </TabsTrigger>
                    </TabsList>
                    
                    <AnimatePresence mode="wait">
                      <TabsContent value="criteri" className="mt-0">
                        {jsonResult && (
                          <motion.div
                            key="criteri"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <CriteriSimiliViewer criteri={jsonResult.criteri} />
                          </motion.div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="executive" className="mt-0">
                        {executiveSummary && (
                          <motion.div
                            key="executive"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <ExecutiveSummary data={executiveSummary} />
                          </motion.div>
                        )}
                      </TabsContent>
                    </AnimatePresence>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 