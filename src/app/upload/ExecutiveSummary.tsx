import React from 'react';
import { motion } from 'framer-motion';
import { Building, Package, Coins, Clock, Users, Calculator, 
         FileCode, ClipboardList, Info, BarChart4 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ExecutiveSummaryProps {
  data?: any;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    }
  })
};

export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  // If no data is provided, show a placeholder or loading state
  if (!data) {
    return (
      <div className="p-6 rounded-xl border border-border/40">
        <h2 className="text-2xl font-medium mb-4 text-foreground">Executive Summary</h2>
        <p className="text-muted-foreground italic">Carica un documento e premi "ANALIZZA" per visualizzare il riepilogo esecutivo.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border border-border/40">
      <h2 className="text-2xl font-medium mb-6 text-center">Executive Summary</h2>
      <div className="space-y-8">
        {/* Stazione Appaltante & Oggetto in a 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryItem 
            index={0}
            icon={<Building className="w-5 h-5 text-primary" />}
            title="Stazione appaltante"
            content={data.stazione_appaltante || data.stazioneAppaltante || "Non specificato"}
          />

          <SummaryItem 
            index={1}
            icon={<Package className="w-5 h-5 text-primary" />}
            title="Oggetto lavori"
            content={data.oggetto_lavori || data.oggetto || "Non specificato"}
          />
        </div>

        <Separator />

        {/* Importo, Scadenze, Formula Economica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryItem 
            index={2}
            icon={<Coins className="w-5 h-5 text-amber-500" />}
            title="Importo base di gara"
            content={data.importo_base_asta || data.importo || "Non specificato"}
          />

          <SummaryItem 
            index={3}
            icon={<Clock className="w-5 h-5 text-rose-500" />}
            title="Scadenze"
            content={
              <>
                {data.scadenza_offerta || data.scadenza 
                  ? <div>Offerta: {data.scadenza_offerta || data.scadenza}</div> 
                  : <div>Offerta: Non specificato</div>}
                {data.scadenza_chiarimenti && <div>Chiarimenti: {data.scadenza_chiarimenti}</div>}
              </>
            }
          />

          <SummaryItem 
            index={4}
            icon={<Calculator className="w-5 h-5 text-indigo-500" />}
            title="Formula Economica"
            content={
              data.formula_economica 
                ? <div className="font-mono text-xs bg-muted p-2 rounded">{data.formula_economica}</div>
                : "Non specificato"
            }
          />
        </div>

        {/* Punteggi */}
        {(data.punteggio_economico !== undefined || data.punteggio_tecnico !== undefined) && (
          <>
            <Separator />
            <SummaryItem 
              index={5}
              icon={<BarChart4 className="w-5 h-5 text-violet-500" />}
              title="Punteggi"
              content={
                <div className="grid grid-cols-3 gap-3">
                  {data.punteggio_tecnico !== undefined && (
                    <div className="py-2 px-3 rounded-lg bg-muted flex flex-col items-center justify-center">
                      <div className="text-xs text-muted-foreground mb-1">Tecnico</div>
                      <div className="text-2xl font-bold text-primary">{data.punteggio_tecnico}</div>
                    </div>
                  )}
                  
                  {data.punteggio_economico !== undefined && (
                    <div className="py-2 px-3 rounded-lg bg-muted flex flex-col items-center justify-center">
                      <div className="text-xs text-muted-foreground mb-1">Economico</div>
                      <div className="text-2xl font-bold text-amber-500">{data.punteggio_economico}</div>
                    </div>
                  )}
                  
                  {data.punteggio_economico !== undefined && data.punteggio_tecnico !== undefined && (
                    <div className="py-2 px-3 rounded-lg bg-muted flex flex-col items-center justify-center">
                      <div className="text-xs text-muted-foreground mb-1">Totale</div>
                      <div className="text-2xl font-bold text-indigo-500">{data.punteggio_economico + data.punteggio_tecnico}</div>
                    </div>
                  )}
                </div>
              }
            />
          </>
        )}

        {/* Criteri */}
        {(data.criteri_discrezionali || data.criteri_quantitativi || data.criteri_tabellari) && (
          <>
            <Separator />
            <SummaryItem 
              index={6}
              icon={<ClipboardList className="w-5 h-5 text-emerald-500" />}
              title="Criteri di valutazione"
              content={
                <div className="space-y-3">
                  {data.criteri_discrezionali && data.criteri_discrezionali.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1.5">Discrezionali:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {data.criteri_discrezionali.map((criterio: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {criterio}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {data.criteri_quantitativi && data.criteri_quantitativi.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1.5">Quantitativi:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {data.criteri_quantitativi.map((criterio: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {criterio}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {data.criteri_tabellari && data.criteri_tabellari.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1.5">Tabellari:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {data.criteri_tabellari.map((criterio: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {criterio}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          </>
        )}

        {/* Informazioni Aggiuntive */}
        {(data.tipologia || data.anno || data.sopralluogo_obbligatorio || data.riparametrizzazione_punteggi) && (
          <>
            <Separator />
            <SummaryItem 
              index={7}
              icon={<Info className="w-5 h-5 text-gray-500" />}
              title="Informazioni Aggiuntive"
              content={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {data.tipologia && (
                    <div className="p-2 rounded-lg bg-muted flex flex-col">
                      <span className="text-xs text-muted-foreground">Tipologia:</span>
                      <span className="font-medium">{data.tipologia}</span>
                    </div>
                  )}
                  {data.anno && (
                    <div className="p-2 rounded-lg bg-muted flex flex-col">
                      <span className="text-xs text-muted-foreground">Anno:</span>
                      <span className="font-medium">{data.anno}</span>
                    </div>
                  )}
                  {data.sopralluogo_obbligatorio && (
                    <div className="p-2 rounded-lg bg-muted flex flex-col">
                      <span className="text-xs text-muted-foreground">Sopralluogo obbligatorio:</span>
                      <span className="font-medium">{data.sopralluogo_obbligatorio}</span>
                    </div>
                  )}
                  {data.riparametrizzazione_punteggi && (
                    <div className="p-2 rounded-lg bg-muted flex flex-col">
                      <span className="text-xs text-muted-foreground">Riparametrizzazione punteggi:</span>
                      <span className="font-medium">{data.riparametrizzazione_punteggi}</span>
                    </div>
                  )}
                </div>
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

interface SummaryItemProps {
  index: number;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

function SummaryItem({ index, icon, title, content }: SummaryItemProps) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className="flex flex-col"
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-base font-medium">{title}</h3>
      </div>
      <div className="text-sm text-foreground">{content}</div>
    </motion.div>
  );
} 