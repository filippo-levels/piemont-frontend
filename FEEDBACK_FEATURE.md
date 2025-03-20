# Criterio Feedback Feature

Questa funzionalità permette agli utenti di inviare feedback sui criteri simili che ritengono non pertinenti.

## Struttura del database

La tabella `criterio_feedback` memorizza i feedback degli utenti:

```sql
CREATE TABLE IF NOT EXISTS criterio_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  criterio_id TEXT NOT NULL,
  similar_criterio_id TEXT NOT NULL,
  similar_filename TEXT NOT NULL,
  user_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indici
```sql
CREATE INDEX idx_criterio_feedback_ids ON criterio_feedback (criterio_id, similar_criterio_id);
CREATE INDEX idx_criterio_feedback_filename ON criterio_feedback (filename);
CREATE INDEX idx_criterio_feedback_similar_filename ON criterio_feedback (similar_filename);
```

## File di supporto

### `src/lib/supabase.ts`
Questo file contiene le funzioni per interagire con Supabase:
- `submitCriterioFeedback`: invia un feedback su un criterio simile
- `extractFilename`: estrae correttamente il nome del file da un ID criterio
- `getOriginalFilename`: recupera il nome del file originale caricato dall'utente dal localStorage

## Gestione dei dati

Il nome del file originale (`filename`) viene recuperato dal risultato dell'analisi salvato in localStorage. Il sistema segue questi passaggi:

1. Quando un utente carica un file tramite `FileUploader`, il risultato dell'analisi (incluso il nome del file originale) viene salvato in localStorage
2. Quando viene inviato un feedback, il sistema recupera il nome del file originale usando `getOriginalFilename()`
3. In caso il nome del file non sia disponibile in localStorage, il sistema usa `extractFilename()` come fallback per estrarre il nome del file dall'ID del criterio

## Implementazione nell'interfaccia utente

Nel componente `CriteriSimiliModal`, è stato aggiunto un pulsante "Feedback" accanto al pulsante "Apri PDF". Quando un utente clicca su questo pulsante:

1. Si apre un modale che chiede all'utente di spiegare perché ritiene che il criterio simile non sia pertinente
2. L'utente inserisce un commento
3. Quando l'utente invia il feedback, i dati vengono salvati nella tabella `criterio_feedback` in Supabase

## Setup richiesto

1. Assicurarsi che le variabili d'ambiente per Supabase siano configurate in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://aamlhnzyjimnfifpqdzz.supabase.co
   NEXT_PUBLIC_SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbWxobnp5amltbmZpZnBxZHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NjczODIsImV4cCI6MjA1ODA0MzM4Mn0.Uufbn6f0ni3cfHlWuIXO4eubGV1FWSYRhOPPFCa8RXY
   ```

2. Creare la tabella `criterio_feedback` in Supabase usando lo script SQL fornito

## Estendere la funzionalità

Per estendere questa funzionalità in futuro, si potrebbero considerare:
1. Aggiungere un dashboard amministrativo per visualizzare e gestire i feedback
2. Implementare un sistema di voto per i criteri simili (positivo/negativo)
3. Usare i feedback raccolti per migliorare l'algoritmo di ricerca dei criteri simili 