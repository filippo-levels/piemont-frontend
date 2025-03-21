"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import FeatureSection from "@/components/FeatureSection";
import { motion } from "framer-motion";
import { Particles } from "@/components/ui/particles";

export default function Home() {
  const router = useRouter();
  const [color, setColor] = useState<string>("#94a3b8");
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Particles background only for homepage */}
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
      
      {/* Hero Section - More Compact */}
      <motion.div 
        className="min-h-[60vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center max-w-3xl z-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Piattaforma di Gestione <span className="text-primary">Disciplinari</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Analizza, gestisci e estrai automaticamente informazioni dai tuoi disciplinari di gara.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
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
      </motion.div>

      {/* Feature Section - Immediately Visible */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeatureSection />
      </div>
    </div>
  );
}
