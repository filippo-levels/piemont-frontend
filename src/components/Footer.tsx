import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Piemontecnica</h3>
            <p className="text-gray-400 text-sm">
              Piattaforma per la gestione e l'analisi dei criteri tecnici.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Link Utili</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?tab=upload" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Upload
                </Link>
              </li>
              <li>
                <Link href="/?tab=gestionale" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Gestionale
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contatti</h3>
            <p className="text-gray-400 text-sm">
              Per informazioni o supporto, contattaci all'indirizzo email: <br />
              <a href="mailto:info@example.com" className="text-blue-400 hover:text-blue-300">
                info@example.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          © {currentYear} Piemontecnica. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
} 