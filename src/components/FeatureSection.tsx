"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, BarChart2, Search, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureSection() {
  return (
    <motion.div 
      className="py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-2xl font-medium mb-8 text-center">Cosa puoi fare con la piattaforma</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Feature 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Estrazione Criteri</h3>
              <p className="text-sm text-muted-foreground">Analizza disciplinari di gara ed estrai automaticamente i criteri tecnici presenti nel documento.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <BarChart2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Executive Summary</h3>
              <p className="text-sm text-muted-foreground">Genera un riepilogo dettagliato del disciplinare con informazioni chiave come importo, scadenze e punteggi.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ricerca Criteri</h3>
              <p className="text-sm text-muted-foreground">Trova facilmente criteri simili tra diversi disciplinari per ottenere spunti utili e comparare soluzioni.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature 4 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-4 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Analisi Intelligente</h3>
              <p className="text-sm text-muted-foreground">Sfrutta algoritmi di intelligenza artificiale per estrarre le informazioni più rilevanti dai documenti.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
} 