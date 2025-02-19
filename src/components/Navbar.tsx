import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-36">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
      </div>
    </nav>
  );
}
