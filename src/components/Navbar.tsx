import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Logo Levels OG a sinistra */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-4">
          <a href="https://levelstech.it" target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/levels_og_logo.png"
              alt="Levels OG Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </a>
        </div>
        
        {/* Logo Piemontecnica al centro */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2">
          <Image
            src="/images/logo-piemontecnica.png"
            alt="Piemontecnica Logo"
            width={100}
            height={100}
            className="object-contain max-h-16"
          />
        </div>
        
        <div className="flex items-center justify-end h-24">
          <div className="flex-1"></div>
          
          <div className="flex items-center space-x-4 z-10">
            <div className="hidden md:flex space-x-4">
              <Link href="/?tab=upload" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium">
                Upload
              </Link>
              <Link href="/?tab=gestionale" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium">
                Gestionale
              </Link>
              <Link href="/?tab=appaltina" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                AppalTina
              </Link>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}