import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <a href="https://levelstech.it" target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/levels_og_logo.png"
              alt="Levels Logo"
              width={180}
              height={180}
              className="object-contain"
            />
          </a>
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