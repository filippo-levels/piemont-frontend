"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, BarChart2, Search, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureSection() {
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-medium mb-6 text-center">Cosa puoi fare con la piattaforma</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Feature 1 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-2 rounded-full mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-medium mb-1">Estrazione Criteri</h3>
              <p className="text-sm text-muted-foreground">Analizza disciplinari di gara ed estrai automaticamente i criteri tecnici presenti nel documento.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-2 rounded-full mb-3">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-medium mb-1">Executive Summary</h3>
              <p className="text-sm text-muted-foreground">Genera un riepilogo dettagliato del disciplinare con informazioni chiave come importo, scadenze e punteggi.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-2 rounded-full mb-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-medium mb-1">Ricerca Criteri</h3>
              <p className="text-sm text-muted-foreground">Trova facilmente criteri simili tra diversi disciplinari per ottenere spunti utili e comparare soluzioni.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 4 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-2 rounded-full mb-3">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-medium mb-1">Analisi Intelligente</h3>
              <p className="text-sm text-muted-foreground">Sfrutta algoritmi di intelligenza artificiale per estrarre le informazioni più rilevanti dai documenti.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
} 