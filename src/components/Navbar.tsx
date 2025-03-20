"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Upload, MessageSquare, Home, FileText, LogIn } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  const router = useRouter();
  
  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/upload');
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Per ora, mostra solo un alert
    alert("Funzionalità di login non ancora implementata");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-gray-50/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Levels OG a sinistra */}
          <div className="flex items-center">
            <a href="https://levelstech.it" target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/logo_levels_nero.png"
                alt="Levels OG Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </a>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                asChild
                variant="ghost"
                className="flex items-center gap-2 hover:bg-gray-200/70"
              >
                <Link href="/">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </Button>
              <Button 
                asChild
                variant="ghost"
                className="flex items-center gap-2 hover:bg-gray-200/70"
              >
                <Link href="/disciplinari">
                  <FileText className="w-4 h-4" />
                  I tuoi disciplinari
                </Link>
              </Button>
              <Button 
                onClick={handleUploadClick}
                variant="ghost"
                className="flex items-center gap-2 hover:bg-gray-200/70"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
              <Button 
                asChild
                variant="ghost"
                className="flex items-center gap-2 hover:bg-gray-200/70"
              >
                <Link href="/lucy">
                  <MessageSquare className="w-4 h-4" />
                  Lucy
                </Link>
              </Button>
            </div>

            {/* Login Button - sempre visibile */}
            <Button 
              onClick={handleLoginClick}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Accedi</span>
            </Button>
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-gray-200/70">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[280px] bg-gray-50">
                <div className="flex flex-col gap-4 py-4">
                  <Button 
                    asChild
                    variant="ghost"
                    className="justify-start flex items-center gap-2 hover:bg-gray-200/70"
                  >
                    <Link href="/">
                      <Home className="w-4 h-4" />
                      Home
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="ghost"
                    className="justify-start flex items-center gap-2 hover:bg-gray-200/70"
                  >
                    <Link href="/disciplinari">
                      <FileText className="w-4 h-4" />
                      I tuoi disciplinari
                    </Link>
                  </Button>
                  <Button 
                    onClick={handleUploadClick}
                    variant="ghost"
                    className="justify-start flex items-center gap-2 hover:bg-gray-200/70"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                  <Button 
                    asChild
                    variant="ghost"
                    className="justify-start flex items-center gap-2 hover:bg-gray-200/70"
                  >
                    <Link href="/lucy">
                      <MessageSquare className="w-4 h-4" />
                      Lucy
                    </Link>
                  </Button>
                  
                  <Separator className="my-4" />
                  
                  {/* Login Button nel menu mobile */}
                  <Button 
                    onClick={handleLoginClick}
                    className="justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <LogIn className="w-4 h-4" />
                    Accedi
                  </Button>
                  
                  {/* Small Levels logo in mobile menu */}
                  <div className="flex items-center gap-2 pl-3 mt-4">
                    <a href="https://levelstech.it" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Image
                        src="/images/logo_levels_nero.png"
                        alt="Levels OG Logo"
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                      <span className="text-sm text-muted-foreground">Powered by Levels</span>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}