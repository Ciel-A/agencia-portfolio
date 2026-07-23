"use client";

import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  modelName: string;
}

export default function Header({ modelName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 glass border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link 
          href="/" 
          className="text-lg font-semibold tracking-widest uppercase hover:opacity-80 transition-opacity"
        >
          {modelName || "AGENCIA"}
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a 
              href="#gallery" 
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Portafolio
            </a>
            <a 
              href="#about" 
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Perfil & Medidas
            </a>
            <a 
              href="#contact" 
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Contacto
            </a>
          </nav>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

          {/* Social icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="https://www.instagram.com/val_patri/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
              aria-label="Instagram"
              title="Instagram: @val_patri"
            >
              <Instagram className="w-[18px] h-[18px]" />
            </a>
            <a
              href="mailto:valentinapatri09@gmail.com"
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
              aria-label="Email"
              title="Email: valentinapatri09@gmail.com"
            >
              <Mail className="w-[18px] h-[18px]" />
            </a>
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
