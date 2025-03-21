"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import CriteriaViewer from "@/app/document/[fileName]/CriteriaViewer";
import CriteriSimiliViewer from "@/app/upload/CriteriSimiliViewer";
import ConsegnaList from "@/components/ConsegnaList";
import axios from "axios";
import JsonDebugViewer from "@/app/upload/components/JsonDebugViewer";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Storage key for debug purposes
const SIMILAR_CRITERIA_DEBUG_KEY = 'similarCriteriaRawJsonResponse';

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const [criteriaData, setCriteriaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('consegne');
  const criteriaRef = useRef<HTMLDivElement>(null);
  const consegneRef = useRef<HTMLDivElement>(null);
  const [similarCriteria, setSimilarCriteria] = useState<any>(null);
  const [showSimilarCriteria, setShowSimilarCriteria] = useState(false);
  const [loadingSimilarCriteria, setLoadingSimilarCriteria] = useState(false);
  const [similarCriteriaRawJson, setSimilarCriteriaRawJson] = useState<any>(null);
  
  const fileName = decodeURIComponent(params.fileName as string);
  const displayFileName = fileName.replace('.json', '');
  const searchFileName = displayFileName.replace('.pdf', '');

  const handleBack = () => {
    // Go to the disciplinary section instead of home
    router.push('/disciplinari');
  };

  const handleView = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/view_file/${fileName}`, '_blank');
  };

  const handleCalculateSimilarCriteria = async () => {
    try {
      setLoadingSimilarCriteria(true);
      
      const fileNameWithPdf = displayFileName.endsWith('.pdf') ? displayFileName : `${displayFileName}.pdf`;
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search_criteri/${encodeURIComponent(fileNameWithPdf)}`
      );
      
      // Store raw response for debugging
      setSimilarCriteriaRawJson(response.data);
      
      // Save to localStorage for persistence
      localStorage.setItem(SIMILAR_CRITERIA_DEBUG_KEY, JSON.stringify(response.data));
      
      // New API response structure doesn't have data wrapper
      const criteriaData = response.data;
      
      // Format data structure for the viewer component
      const formattedData = {
        criteri: criteriaData.criteri
      };
      
      setSimilarCriteria(formattedData);
      setShowSimilarCriteria(true);
      // Switch to criteri tab to show the results
      setActiveTab('criteri');
    } catch (error) {
      console.error('Error calculating similar criteria:', error);
      alert('Errore durante il recupero dei criteri simili');
    } finally {
      setLoadingSimilarCriteria(false);
    }
  };

  // Load saved similar criteria JSON on component mount
  useEffect(() => {
    try {
      const savedJson = localStorage.getItem(SIMILAR_CRITERIA_DEBUG_KEY);
      if (savedJson) {
        setSimilarCriteriaRawJson(JSON.parse(savedJson));
      }
    } catch (error) {
      console.error('Error loading saved similar criteria JSON:', error);
    }
  }, []);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get_criterias/${fileName}`);
        
        // Handle the new response structure directly
        if (response.data && typeof response.data === 'object') {
          if (response.data.criteri && Array.isArray(response.data.criteri)) {
            // Direct structure with criteri array - new API format
            setCriteriaData(response.data);
          } else if (response.data.data && response.data.data.criteri) {
            // Handle legacy structure with data wrapper for backwards compatibility
            setCriteriaData(response.data);
          } else {
            // Try with the entire response as fallback
            setCriteriaData(response.data);
          }
        } else {
          setError('Formato di risposta non valido');
        }
      } catch (error: any) {
        console.error('Error fetching criteria:', error);
        setError('Errore durante il recupero dei criteri. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchCriteria();
  }, [fileName]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Card */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-words">
                  {displayFileName}
                </CardTitle>
                {!loading && !error && criteriaData && (
                  <CardDescription className="text-gray-600 mt-1">
                    Ultimo aggiornamento: {new Date(
                      (criteriaData.data_ora || criteriaData.data?.data_ora || new Date())
                    ).toLocaleString('it-IT')}
                  </CardDescription>
                )}
              </div>
              <div className="flex flex-wrap w-full md:w-auto gap-3">
                <Button 
                  onClick={handleView} 
                  className="bg-[#3dcab1] hover:bg-[#3dcab1]/90 text-white flex-1 md:flex-none"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Visualizza
                </Button>
                <Button 
                  onClick={handleBack} 
                  variant="outline" 
                  className="flex-1 md:flex-none"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Torna ai Disciplinari
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-gray-100">
            <TabsTrigger 
              value="consegne" 
              className={cn(
                "data-[state=active]:bg-[#3dcab1] data-[state=active]:text-white"
              )}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Lista Consegne
            </TabsTrigger>
            <TabsTrigger 
              value="criteri" 
              className={cn(
                "data-[state=active]:bg-[#3dcab1] data-[state=active]:text-white"
              )}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Criteri di Valutazione
            </TabsTrigger>
          </TabsList>

          {/* Consegne Content */}
          <TabsContent value="consegne" ref={consegneRef} className="scroll-mt-24">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                  <svg className="w-6 h-6 mr-2 text-[#3dcab1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Lista Consegne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConsegnaList key={`consegna-list-${searchFileName}`} initialSearchTerm={searchFileName} singleColumn={true} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Criteri Content */}
          <TabsContent value="criteri" ref={criteriaRef} className="scroll-mt-24">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                    <svg className="w-6 h-6 mr-2 text-[#3dcab1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Criteri di Valutazione
                  </CardTitle>
                  
                  {!showSimilarCriteria && (
                    <Button
                      onClick={handleCalculateSimilarCriteria}
                      disabled={loadingSimilarCriteria || loading}
                      className="bg-[#3dcab1] hover:bg-[#3dcab1]/90 text-white"
                    >
                      {loadingSimilarCriteria ? (
                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      Calcola Criteri Simili
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="space-y-3">
                        <Skeleton className="h-8 w-32 bg-gray-200" />
                        <Skeleton className="h-4 w-full bg-gray-200" />
                        <Skeleton className="h-4 w-full bg-gray-200" />
                        <Skeleton className="h-4 w-2/3 bg-gray-200" />
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : loadingSimilarCriteria ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <svg className="animate-spin h-16 w-16 text-[#3dcab1] mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-gray-600 font-medium">Calcolo criteri simili in corso...</p>
                    </div>
                  ) : showSimilarCriteria && similarCriteria ? (
                    <>
                      <CriteriSimiliViewer 
                        criteri={similarCriteria.criteri} 
                      />
                      
                      {/* Debug JSON viewer for similar criteria */}
                      {similarCriteriaRawJson && (
                        <div className="mt-6 border-t pt-4">
                          <div className="custom-json-debug">
                            <JsonDebugViewer 
                              type="criteri"
                              jsonData={similarCriteriaRawJson}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <CriteriaViewer data={criteriaData} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 