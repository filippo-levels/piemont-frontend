import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <a href="https://levelstech.it" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
              <Image
                src="/images/logo levels.png"
                alt="LevelsTech Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </a>
            
            <div className="hidden md:flex space-x-4">
              <Link href="/" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/?tab=upload" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium">
                Upload
              </Link>
              <Link href="/?tab=gestionale" className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium">
                Gestionale
              </Link>
            </div>
          </div>
          
          <div className="flex-none">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}