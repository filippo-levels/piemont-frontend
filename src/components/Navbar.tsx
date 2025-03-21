"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/upload');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-24">
          {/* Logo Levels OG a sinistra - visibile solo su desktop */}
          <div className="hidden md:block">
            <a href="https://levelstech.it" target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/levels_og_logo.png"
                alt="Levels OG Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </a>
          </div>
          
          {/* Logo Piemontecnica al centro */}
          <div className="flex-1 flex justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <Link href="/">
              <Image
                src="/images/logo-piemontecnica.png"
                alt="Piemontecnica Logo"
                width={70}
                height={70}
                className="object-contain max-h-10 sm:max-h-12 md:max-h-16"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="#" 
              onClick={handleUploadClick}
              className="relative overflow-hidden group text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:bg-blue-600/10 border border-transparent hover:border-blue-500"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload
              </span>
            </a>
            <Link 
              href="/lucy" 
              className="relative overflow-hidden group text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:bg-blue-600/10 border border-transparent hover:border-blue-500 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Lucy
            </Link>

          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-1.5 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="#" 
              onClick={handleUploadClick}
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload
            </a>
            <Link 
              href="/lucy" 
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Lucy
            </Link>
          </div>
          
          {/* Small Levels logo in mobile menu */}
          <div className="px-4 py-3 border-t border-gray-800 flex justify-start">
            <a href="https://levelstech.it" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <Image
                src="/images/levels_og_logo.png"
                alt="Levels OG Logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-400">Powered by Levels</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}