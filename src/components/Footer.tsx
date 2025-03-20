import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">LEVELS OG</h3>
            <p className="text-gray-400 text-sm">
              Piattaforma per la gestione e l'analisi dei criteri tecnici.
            </p>
          </div>
          
          <div className="md:text-right">
            <h3 className="text-lg font-semibold mb-4">Contatti</h3>
            <p className="text-gray-400 text-sm">
              Per informazioni o supporto, contattaci all'indirizzo email: <br />
              <a href="mailto:info@example.com" className="text-blue-400 hover:text-blue-300">
                info@levelstech.it
              </a>
            </p>
          </div>
        </div>
        

      </div>
    </footer>
  );
} 