import { Instagram, Mail, MapPin, Globe } from "lucide-react";

interface FooterProps {
  modelName: string;
}

export default function Footer({ modelName }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="w-full bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-200/50 dark:border-zinc-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Contact info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Contacto & Booking
            </h4>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 font-light">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-zinc-400" />
                <a 
                  href="mailto:valentinapatri09@gmail.com" 
                  className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                >
                  valentinapatri09@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>

          {/* Right Column: Social Links */}
          <div className="md:text-right space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Redes Sociales
            </h4>
            <div className="flex md:justify-end gap-5">
              <a
                href="https://www.instagram.com/val_patri/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-250"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:valentinapatri09@gmail.com"
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-250"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright bottom area */}
        <div className="mt-12 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 font-light gap-4">
          <p>© {currentYear} {modelName || "Agencia Portfolio"}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold tracking-wider text-zinc-600 dark:text-zinc-400 uppercase">Stitch UI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
