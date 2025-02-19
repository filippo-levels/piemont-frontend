import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="border-b bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-none">
            <a href="https://levelstech.it" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
              <Image
                src="/images/logo levels.png"
                alt="LevelsTech Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </a>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 my-2"> {/* Aggiunto my-2 per il margine verticale */}
            <a href="https://piemontecnica.com" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
              <Image
                src="/images/logo-piemontecnica-solo-quad-trsp.png"
                alt="Piemontecnica Logo"
                width={60} 
                height={60}
                className="object-contain mt-1 mb-1" 
              />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}