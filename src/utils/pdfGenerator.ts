import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

interface Criterio {
  id: string;
  nome: string;
  punteggioMassimo: string;
  descrizione: string;
  criteriSimili: Array<{
    id: string;
    score: number;
    documents: string;
    criterio_id: string;
    filename: string;
  }>;
  subCriteri: Criterio[];
}

/**
 * Prepares data for export by flattening the criteria structure
 */
export const prepareDataForExport = (criteri: Criterio[]) => {
  const flattenedData: any[] = [];
  
  const flattenCriteria = (criterio: Criterio, parentId = '') => {
    // Aggiungi il criterio principale
    flattenedData.push({
      'Tipo': 'Criterio Principale',
      'ID': criterio.id,
      'Nome': criterio.nome,
      'Punteggio Massimo': criterio.punteggioMassimo,
      'Descrizione': criterio.descrizione,
      'Parent ID': parentId
    });
    
    // Aggiungi i criteri simili
    if (criterio.criteriSimili?.length > 0) {
      criterio.criteriSimili.forEach(similar => {
        flattenedData.push({
          'Tipo': 'Criterio Simile',
          'ID': similar.criterio_id,
          'Nome': '',
          'Punteggio Massimo': '',
          'Descrizione': similar.documents,
          'Parent ID': criterio.id,
          'Score': Math.floor(similar.score) + '%',
          'Filename': similar.filename
        });
      });
    }
    
    // Processa i subcriteri ricorsivamente
    if (criterio.subCriteri?.length > 0) {
      criterio.subCriteri.forEach(sub => {
        flattenCriteria(sub, criterio.id);
      });
    }
  };
  
  // Processa tutti i criteri
  criteri.forEach(criterio => {
    flattenCriteria(criterio);
  });
  
  return flattenedData;
};

/**
 * Generates and downloads a PDF with criteria data
 */
export const generatePDF = (criteri: Criterio[], customSummaryData?: any) => {
  const data = prepareDataForExport(criteri);
  
  // Crea un nuovo documento PDF
  const doc = new jsPDF();
  
  // Default summary data if not provided
  const summaryData = customSummaryData || {
    stazioneAppaltante: "Comune di Torino - Direzione Infrastrutture",
    oggetto: "Lavori di manutenzione straordinaria e riqualificazione della rete fognaria cittadina",
    importo: "€ 12.450.000,00",
    scadenza: "15/04/2024 ore 12:00",
    identificativi: {
      CIG: "9283746510",
      CUP: "J45H22000180001",
      CPV: "45231300-8"
    },
    rup: "Ing. Marco Rossi"
  };
  
  // Aggiungi titolo
  doc.setFontSize(18);
  doc.text("Criteri Estratti", 14, 22);
  
  // Aggiungi executive summary
  doc.setFontSize(14);
  doc.text("Executive Summary", 14, 35);
  
  doc.setFontSize(10);
  doc.text("Stazione appaltante:", 14, 45);
  doc.text(summaryData.stazioneAppaltante, 60, 45);
  
  doc.text("Oggetto:", 14, 52);
  doc.text(summaryData.oggetto, 60, 52, { maxWidth: 130 });
  
  doc.text("Importo:", 14, 65);
  doc.text(summaryData.importo, 60, 65);
  
  doc.text("Scadenza:", 14, 72);
  doc.text(summaryData.scadenza, 60, 72);
  
  doc.text("CIG:", 14, 79);
  doc.text(summaryData.identificativi.CIG, 60, 79);
  
  doc.text("CUP:", 14, 86);
  doc.text(summaryData.identificativi.CUP, 60, 86);
  
  doc.text("RUP:", 14, 93);
  doc.text(summaryData.rup, 60, 93);
  
  // Aggiungi titolo tabella criteri
  doc.setFontSize(14);
  doc.text("Criteri di Valutazione", 14, 105);
  
  // Prepara i dati per la tabella
  const tableData = data.filter(item => item['Tipo'] === 'Criterio Principale').map(item => [
    item['ID'],
    item['Nome'],
    item['Punteggio Massimo'],
    item['Descrizione'].substring(0, 60) + (item['Descrizione'].length > 60 ? '...' : '')
  ]);
  
  // Definisci le colonne della tabella
  const tableColumns = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Nome', dataKey: 'nome' },
    { header: 'Punteggio', dataKey: 'punteggio' },
    { header: 'Descrizione', dataKey: 'descrizione' }
  ];
  
  // Genera la tabella
  autoTable(doc, {
    head: [tableColumns.map(col => col.header)],
    body: tableData,
    startY: 110,
    margin: { top: 110 },
    styles: { overflow: 'linebreak' },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 110 }
    },
    headStyles: {
      fillColor: [61, 202, 177],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    }
  });
  
  // Genera un nome file con data e ora
  const date = new Date();
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;
  const fileName = `criteri_estratti_${formattedDate}.pdf`;
  
  // Scarica il file
  doc.save(fileName);
}; 