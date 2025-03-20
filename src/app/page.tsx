"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Upload, FileText, ChevronDown } from "lucide-react";
import FeatureSection from "@/components/FeatureSection";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Animation */}
      <motion.div 
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-background px-4 sm:px-6 lg:px-8 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Piattaforma di Gestione <span className="text-primary">Disciplinari</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10">
            Analizza, gestisci e estrai automaticamente informazioni dai tuoi disciplinari di gara in modo semplice ed efficiente.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => router.push('/upload')} size="lg" className="gap-2">
              <Upload className="h-4 w-4" />
              Carica un documento
            </Button>
            <Button onClick={() => router.push('/disciplinari')} variant="outline" size="lg" className="gap-2">
              <FileText className="h-4 w-4" />
              I tuoi disciplinari
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10"
        >
          <ChevronDown 
            className="h-8 w-8 animate-bounce cursor-pointer" 
            onClick={() => {
              const featuresSection = document.querySelector('.py-10');
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </motion.div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {/* Header Section */}
        <div className="text-center py-10">
          <h1 className="text-3xl font-medium mb-4">
            Piattaforma di Gestione Disciplinari
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Analizza e gestisci i tuoi disciplinari di gara.
          </p>
        </div>

        {/* Feature Section */}
        <FeatureSection />
      </div>
    </div>
  );
}
