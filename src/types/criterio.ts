export interface Criterio {
  id: string;
  nome: string;
  punteggioMassimo: string;
  descrizione: string;
  criteriSimili?: Array<{
    id: string;
    score: number;
    documents: string;
    criterio_id: string;
    filename: string;
  }>;
  subCriteri?: Criterio[];
} 