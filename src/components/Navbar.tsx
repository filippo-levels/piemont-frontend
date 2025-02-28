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
          
          <div className="flex-none">
            <button className="outline outline-white text-white font-medium py-2 px-4 rounded-md transition duration-300">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}