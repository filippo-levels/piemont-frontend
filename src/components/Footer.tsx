"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 text-foreground border-t py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-base font-medium mb-2">LEVELS OG</h3>
            <p className="text-muted-foreground text-sm">
              Piattaforma per la gestione e l'analisi dei criteri tecnici.
            </p>
          </motion.div>
          
          <motion.div 
            className="md:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-base font-medium mb-2">Contatti</h3>
            <p className="text-muted-foreground text-sm">
              Per informazioni o supporto, contattaci all'indirizzo email: <br />
              <a href="mailto:info@levelstech.it" className="text-primary hover:underline">
                info@levelstech.it
              </a>
            </p>
          </motion.div>
        </div>
        
        <Separator className="my-4" />
        
        <motion.div 
          className="text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>© {currentYear} Levels OG. Tutti i diritti riservati.</p>
        </motion.div>
      </div>
    </footer>
  );
} 