import React, { useState, useEffect } from "react";
import ConsegnaList from "../../components/ConsegnaList";
import { Criterio } from "../../types/criterio";
import { submitCriterioFeedback, extractFilename, getOriginalFilename } from "../../lib/supabase";

interface CriteriSimiliModalProps {
  isOpen: boolean;
  onClose: () => void;
  criterio: Criterio;
}

const CriteriSimiliModal: React.FC<CriteriSimiliModalProps> = ({
  isOpen,
  onClose,
  criterio
}) => {
  const [selectedSimilarCriterio, setSelectedSimilarCriterio] = useState<{
    id: string;
    score: number;
    documents: string;
    criterio_id: string;
    filename: string;
  } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedSimilarDescription, setExpandedSimilarDescription] = useState(false);

  // Control body overflow when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    return () => {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when component unmounts
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  const openDisciplinare = (filename: string) => {
    try {
      // Rimuove .json se presente e aggiunge .pdf
      const fileName = filename.replace('.json', '') + '.pdf';
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/view_file/${fileName}`, '_blank');
    } catch (error) {
      console.error('Errore nell\'apertura del file:', error);
      alert('File non trovato o errore nell\'apertura del file');
    }
  };

  const handleSelectSimilarCriterio = (similarCriterio: {
    id: string;
    score: number;
    documents: string;
    criterio_id: string;
    filename: string;
  }) => {
    setSelectedSimilarCriterio(similarCriterio);
    setExpandedSimilarDescription(false); // Reset expanded state when switching criterio
  };

  const openFeedbackModal = () => {
    setFeedbackModalOpen(true);
    setFeedbackComment('');
    setFeedbackSuccess(false);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
  };

  const submitFeedback = async () => {
    if (!selectedSimilarCriterio) return;
    
    setSubmittingFeedback(true);
    
    try {
      // Get the original uploaded filename from localStorage
      const originalFilename = getOriginalFilename() || extractFilename(criterio.id);
      
      // Extract similar criterio filename
      const similarFilename = extractFilename(selectedSimilarCriterio.filename);
      
      const { error } = await submitCriterioFeedback({
        filename: originalFilename,
        criterio_id: criterio.id,
        similar_criterio_id: selectedSimilarCriterio.criterio_id,
        similar_filename: similarFilename,
        user_comment: feedbackComment
      });
      
      if (error) throw error;
      
      setFeedbackSuccess(true);
      setTimeout(() => {
        closeFeedbackModal();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Si è verificato un errore durante l\'invio del feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Check if descriptions are long
  const isLongDescription = criterio.descrizione && criterio.descrizione.length > 100;
  const isLongSimilarDescription = selectedSimilarCriterio?.documents && selectedSimilarCriterio.documents.length > 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-800 truncate">
            Criterio e Criteri Simili
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Left side - Selected Criterio */}
          <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r">
            <div className="mb-4">
              <div className="mb-3">
                <h4 className="text-lg font-semibold text-gray-800 mb-1 break-words">
                  {criterio.id} - {criterio.nome}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-md text-center">
                    {criterio.punteggioMassimo} punti
                  </span>
                  <button
                    onClick={() => copyToClipboard(criterio.descrizione)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full flex-shrink-0"
                    title="Copia testo del criterio"
                  >
                    {copySuccess ? (
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                {isLongDescription ? (
                  <>
                    <p className={`text-gray-700 text-sm leading-relaxed ${expandedDescription ? '' : 'line-clamp-3'}`}>
                      {criterio.descrizione}
                    </p>
                    <button
                      onClick={() => setExpandedDescription(!expandedDescription)}
                      className="text-blue-500 text-sm mt-2 hover:underline focus:outline-none inline-flex items-center"
                    >
                      {expandedDescription ? 'Mostra meno' : 'Mostra altro'}
                      <svg className={`ml-1 w-4 h-4 transform transition-transform ${expandedDescription ? 'rotate-180' : ''}`} 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed">{criterio.descrizione}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Middle section - Similar Criteria List */}
          <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r bg-gray-50">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#3dcab1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Criteri Simili
            </h4>
            
            {/* List of all criteria */}
            <div className="space-y-3">
              {criterio.criteriSimili?.map((similarCriterio) => (
                <div 
                  key={similarCriterio.id}
                  className={`border rounded-lg p-3 bg-white shadow-sm cursor-pointer transition-all duration-200 ${
                    selectedSimilarCriterio?.id === similarCriterio.id 
                      ? 'border-[#3dcab1] ring-2 ring-[#3dcab1] ring-opacity-50' 
                      : 'hover:border-[#3dcab1] hover:shadow'
                  }`}
                  onClick={() => handleSelectSimilarCriterio(similarCriterio)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium text-gray-800 text-sm">ID: {similarCriterio.criterio_id}</h5>
                      <p className="text-xs text-gray-500 truncate">{similarCriterio.filename.replace('.json', '')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#3dcab1]/10 text-[#3dcab1] px-2 py-0.5 rounded-full text-xs font-medium">
                        {Math.floor(similarCriterio.score)}%
                      </span>
                      {selectedSimilarCriterio?.id === similarCriterio.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(similarCriterio.documents);
                          }}
                          className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 rounded-full flex-shrink-0"
                          title="Copia testo del criterio simile"
                        >
                          {copySuccess ? (
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {selectedSimilarCriterio?.id === similarCriterio.id ? (
                    <>
                      <div className="text-sm text-gray-700 leading-relaxed my-2 border-t border-b border-gray-100 py-2">
                        {isLongSimilarDescription ? (
                          <>
                            <p className={`${expandedSimilarDescription ? '' : 'line-clamp-3'}`}>
                              {similarCriterio.documents}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedSimilarDescription(!expandedSimilarDescription);
                              }}
                              className="text-blue-500 text-sm mt-2 hover:underline focus:outline-none inline-flex items-center"
                            >
                              {expandedSimilarDescription ? 'Mostra meno' : 'Mostra altro'}
                              <svg className={`ml-1 w-4 h-4 transform transition-transform ${expandedSimilarDescription ? 'rotate-180' : ''}`} 
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <p>{similarCriterio.documents}</p>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openFeedbackModal();
                          }}
                          className="px-3 py-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors flex items-center text-xs"
                          title="Segnala criterio non pertinente"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M9 16h6" />
                          </svg>
                          Feedback
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDisciplinare(similarCriterio.filename);
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center text-xs"
                          title="Apri il disciplinare in una nuova finestra"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Apri PDF
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{similarCriterio.documents}</p>
                  )}
                </div>
              ))}
            </div>
            
            {!selectedSimilarCriterio && (!criterio.criteriSimili || criterio.criteriSimili.length === 0) && (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-center">Nessun criterio simile disponibile</p>
              </div>
            )}
          </div>
          
          {/* Right side - ConsegnaList */}
          <div className="w-full md:w-1/3 overflow-y-auto bg-white">
            {selectedSimilarCriterio ? (
              <>
                <div className="sticky top-0 bg-white p-3 border-b z-10">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Lista Consegne
                  </h4>
                </div>
                <ConsegnaList initialSearchTerm={selectedSimilarCriterio.filename.replace('.json', '')} singleColumn={true} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-center">Seleziona un criterio simile per visualizzare la lista consegne</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M9 16h6" />
                </svg>
                Segnala Criterio Non Pertinente
              </h3>
              <button
                onClick={closeFeedbackModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Ci dispiace che questo criterio simile non sia utile. Aiutaci a migliorare spiegando perché ritieni che non sia pertinente:
              </p>
              
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3dcab1] focus:border-[#3dcab1] h-32 text-sm"
                placeholder="Descrivi brevemente perché ritieni che questo criterio non sia pertinente..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                disabled={submittingFeedback || feedbackSuccess}
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={closeFeedbackModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                disabled={submittingFeedback || feedbackSuccess}
              >
                Annulla
              </button>
              <button
                onClick={submitFeedback}
                className="px-4 py-2 bg-[#3dcab1] text-white rounded-md hover:bg-[#35b39d] transition-colors text-sm flex items-center"
                disabled={submittingFeedback || feedbackSuccess || !feedbackComment.trim()}
              >
                {submittingFeedback ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Invio...
                  </>
                ) : feedbackSuccess ? (
                  <>
                    <svg className="h-4 w-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Inviato!
                  </>
                ) : (
                  'Invia Feedback'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriteriSimiliModal; 