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
 * Generates and downloads a PDF with criteria data and executive summary
 */
export const generatePDF = (criteri: Criterio[], executiveSummary?: any) => {
  const data = prepareDataForExport(criteri);
  
  // Crea un nuovo documento PDF
  const doc = new jsPDF();
  
  // Aggiungi titolo
  doc.setFontSize(18);
  doc.text("Analisi Disciplinare di Gara", 14, 22);
  
  // Aggiungi executive summary
  doc.setFontSize(14);
  doc.text("Executive Summary", 14, 35);
  
  doc.setFontSize(10);
  let yPos = 45;
  
  if (executiveSummary) {
    // Stazione appaltante
    doc.text("Stazione appaltante:", 14, yPos);
    doc.text(executiveSummary.stazione_appaltante || executiveSummary.stazioneAppaltante || "Non specificato", 60, yPos);
    yPos += 7;
    
    // Oggetto
    doc.text("Oggetto:", 14, yPos);
    const oggettoText = executiveSummary.oggetto_lavori || executiveSummary.oggetto || "Non specificato";
    doc.text(oggettoText, 60, yPos, { maxWidth: 130 });
    yPos += oggettoText.length > 60 ? 14 : 7;
    
    // Importo
    doc.text("Importo:", 14, yPos);
    doc.text(executiveSummary.importo_base_asta || executiveSummary.importo || "Non specificato", 60, yPos);
    yPos += 7;
    
    // Scadenza
    doc.text("Scadenza:", 14, yPos);
    doc.text(executiveSummary.scadenza_offerta || executiveSummary.scadenza || "Non specificato", 60, yPos);
    yPos += 7;
    
    // Scadenza chiarimenti
    if (executiveSummary.scadenza_chiarimenti) {
      doc.text("Scadenza chiarimenti:", 14, yPos);
      doc.text(executiveSummary.scadenza_chiarimenti, 60, yPos);
      yPos += 7;
    }
    
    // CIG
    if (executiveSummary.identificativi?.CIG || executiveSummary.CIG) {
      doc.text("CIG:", 14, yPos);
      doc.text(executiveSummary.identificativi?.CIG || executiveSummary.CIG, 60, yPos);
      yPos += 7;
    }
    
    // CUP
    if (executiveSummary.identificativi?.CUP || executiveSummary.CUP) {
      doc.text("CUP:", 14, yPos);
      doc.text(executiveSummary.identificativi?.CUP || executiveSummary.CUP, 60, yPos);
      yPos += 7;
    }
    
    // CPV
    if (executiveSummary.identificativi?.CPV || executiveSummary.CPV) {
      doc.text("CPV:", 14, yPos);
      doc.text(executiveSummary.identificativi?.CPV || executiveSummary.CPV, 60, yPos);
      yPos += 7;
    }
    
    // RUP
    if (executiveSummary.rup) {
      doc.text("RUP:", 14, yPos);
      doc.text(executiveSummary.rup, 60, yPos);
      yPos += 7;
    }
    
    // Punteggi
    if (executiveSummary.punteggio_economico !== undefined || executiveSummary.punteggio_tecnico !== undefined) {
      yPos += 3;
      doc.text("Punteggi:", 14, yPos);
      
      if (executiveSummary.punteggio_economico !== undefined) {
        doc.text(`Economico: ${executiveSummary.punteggio_economico} punti`, 60, yPos);
        yPos += 7;
      }
      
      if (executiveSummary.punteggio_tecnico !== undefined) {
        doc.text(`Tecnico: ${executiveSummary.punteggio_tecnico} punti`, 60, yPos);
        yPos += 7;
      }
      
      if (executiveSummary.punteggio_economico !== undefined && executiveSummary.punteggio_tecnico !== undefined) {
        const totale = executiveSummary.punteggio_economico + executiveSummary.punteggio_tecnico;
        doc.text(`Totale: ${totale} punti`, 60, yPos);
        yPos += 7;
      }
    }
    
    // Formula economica
    if (executiveSummary.formula_economica) {
      doc.text("Formula economica:", 14, yPos);
      doc.text(executiveSummary.formula_economica, 60, yPos, { maxWidth: 130 });
      yPos += executiveSummary.formula_economica.length > 60 ? 14 : 7;
    }
    
    // Tipologia
    if (executiveSummary.tipologia) {
      doc.text("Tipologia:", 14, yPos);
      doc.text(executiveSummary.tipologia, 60, yPos);
      yPos += 7;
    }
    
    // Anno
    if (executiveSummary.anno) {
      doc.text("Anno:", 14, yPos);
      doc.text(executiveSummary.anno.toString(), 60, yPos);
      yPos += 7;
    }
    
    // Sopralluogo obbligatorio
    if (executiveSummary.sopralluogo_obbligatorio) {
      doc.text("Sopralluogo obbligatorio:", 14, yPos);
      doc.text(executiveSummary.sopralluogo_obbligatorio.toString(), 60, yPos);
      yPos += 7;
    }
    
    // Riparametrizzazione punteggi
    if (executiveSummary.riparametrizzazione_punteggi) {
      doc.text("Riparametrizzazione punteggi:", 14, yPos);
      doc.text(executiveSummary.riparametrizzazione_punteggi.toString(), 60, yPos);
      yPos += 7;
    }
    
    // Lotti
    if (executiveSummary.numero_importo_lotti && executiveSummary.numero_importo_lotti.length > 0) {
      yPos += 3;
      doc.text("Lotti:", 14, yPos);
      yPos += 7;
      
      executiveSummary.numero_importo_lotti.forEach((lotto: any, index: number) => {
        doc.text(`Lotto ${index + 1}:`, 20, yPos);
        yPos += 5;
        
        if (lotto.CIG) {
          doc.text(`CIG: ${lotto.CIG}`, 25, yPos);
          yPos += 5;
        }
        
        if (lotto.importo) {
          doc.text(`Importo: ${lotto.importo}`, 25, yPos);
          yPos += 5;
        }
        
        yPos += 2; // Spazio tra lotti
      });
    }
    
    // Criteri di valutazione
    const hasCriteri = executiveSummary.criteri_discrezionali || 
                       executiveSummary.criteri_quantitativi || 
                       executiveSummary.criteri_tabellari;
    
    if (hasCriteri) {
      yPos += 3;
      doc.text("Criteri di valutazione:", 14, yPos);
      yPos += 7;
      
      if (executiveSummary.criteri_discrezionali && executiveSummary.criteri_discrezionali.length > 0) {
        doc.text("Discrezionali:", 20, yPos);
        yPos += 5;
        
        executiveSummary.criteri_discrezionali.forEach((criterio: string, index: number) => {
          doc.text(`- ${criterio}`, 25, yPos);
          yPos += 5;
        });
        
        yPos += 2;
      }
      
      if (executiveSummary.criteri_quantitativi && executiveSummary.criteri_quantitativi.length > 0) {
        doc.text("Quantitativi:", 20, yPos);
        yPos += 5;
        
        executiveSummary.criteri_quantitativi.forEach((criterio: string, index: number) => {
          doc.text(`- ${criterio}`, 25, yPos);
          yPos += 5;
        });
        
        yPos += 2;
      }
      
      if (executiveSummary.criteri_tabellari && executiveSummary.criteri_tabellari.length > 0) {
        doc.text("Tabellari:", 20, yPos);
        yPos += 5;
        
        executiveSummary.criteri_tabellari.forEach((criterio: string, index: number) => {
          doc.text(`- ${criterio}`, 25, yPos);
          yPos += 5;
        });
        
        yPos += 2;
      }
    }
    
    // Altri campi non standard
    const displayedFields = [
      'stazione_appaltante', 'stazioneAppaltante', 'oggetto', 'oggetto_lavori', 
      'importo', 'importo_base_asta', 'scadenza', 'scadenza_offerta', 'scadenza_chiarimenti',
      'identificativi', 'CIG', 'CUP', 'CPV', 'rup', 'procedura', 'numero_importo_lotti',
      'punteggio_economico', 'punteggio_tecnico', 'formula_economica', 'criteri_discrezionali',
      'criteri_quantitativi', 'criteri_tabellari', 'tipologia', 'anno', 'sopralluogo_obbligatorio',
      'riparametrizzazione_punteggi', 'file_name', 'data_ora'
    ];
    
    // Aggiungi altri campi che potrebbero essere presenti
    Object.entries(executiveSummary).forEach(([key, value]) => {
      if (!displayedFields.includes(key) && typeof value !== 'object') {
        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:`, 14, yPos);
        doc.text(String(value), 60, yPos);
        yPos += 7;
      }
    });
    
  } else {
    // Default summary data if not provided
    doc.text("Stazione appaltante:", 14, yPos);
    doc.text("Non specificato", 60, yPos);
    yPos += 7;
    
    doc.text("Oggetto:", 14, yPos);
    doc.text("Non specificato", 60, yPos);
    yPos += 7;
    
    doc.text("Importo:", 14, yPos);
    doc.text("Non specificato", 60, yPos);
    yPos += 7;
    
    doc.text("Scadenza:", 14, yPos);
    doc.text("Non specificato", 60, yPos);
    yPos += 7;
  }
  
  // Aggiungi una nuova pagina se necessario per i criteri
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }
  
  // Aggiungi titolo tabella criteri
  yPos += 10;
  doc.setFontSize(14);
  doc.text("Criteri di Valutazione", 14, yPos);
  yPos += 10;
  
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
    startY: yPos,
    margin: { top: yPos },
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
  const fileName = `analisi_disciplinare_${formattedDate}.pdf`;
  
  // Scarica il file
  doc.save(fileName);
}; 