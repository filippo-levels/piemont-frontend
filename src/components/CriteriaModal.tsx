"use client";
import { useEffect, useRef } from 'react';

interface CriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteriaData: any;
}

export default function CriteriaModal({ isOpen, onClose, criteriaData }: CriteriaModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Blocca lo scroll del body quando il modal è aperto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Gestione click fuori dal modal per chiuderlo
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !criteriaData) return null;

  // Formatta la data in un formato leggibile
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-teal-700 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Dettaglio Criteri</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-sm">
            <p><span className="font-semibold">File:</span> {criteriaData.file_name}</p>
            <p><span className="font-semibold">Data e ora:</span> {formatDate(criteriaData.data_ora)}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Criteri identificati</h3>
          
          {criteriaData.criteri && criteriaData.criteri.length > 0 ? (
            <div className="space-y-6">
              {criteriaData.criteri.map((criterio: any, index: number) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-teal-50 p-4 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-teal-800">{criterio.id} - {criterio.nome}</h4>
                        <p className="text-sm text-gray-600 mt-1">Punteggio massimo: {criterio.punteggioMassimo}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white">
                    <p className="text-sm text-gray-700 mb-4">{criterio.descrizione}</p>
                    
                    {criterio.subCriteri && criterio.subCriteri.length > 0 && (
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-teal-200">
                        <h5 className="font-semibold text-gray-700">Sotto-criteri:</h5>
                        {criterio.subCriteri.map((subCriterio: any, subIndex: number) => (
                          <div key={subIndex} className="bg-gray-50 p-3 rounded-md">
                            <h6 className="font-semibold text-teal-700">{subCriterio.id} - {subCriterio.nome}</h6>
                            <p className="text-xs text-gray-600 mt-1">Punteggio massimo: {subCriterio.punteggioMassimo}</p>
                            <p className="text-sm text-gray-700 mt-2">{subCriterio.descrizione}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nessun criterio disponibile</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
} 