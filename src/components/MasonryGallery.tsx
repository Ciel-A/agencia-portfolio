"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ModelImage } from "@/lib/types";

interface MasonryGalleryProps {
  gallery: ModelImage[];
}

export default function MasonryGallery({ gallery }: MasonryGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) {
    return (
      <div className="w-full text-center py-12 text-zinc-500">
        No hay imágenes disponibles en la galería.
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedIdx(index);
  };

  const closeLightbox = () => {
    setSelectedIdx(null);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx + 1) % gallery.length);
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx - 1 + gallery.length) % gallery.length);
  };

  return (
    <section id="gallery" className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight mb-8 uppercase text-center sm:text-left border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">
        Portafolio
      </h2>

      {/* Masonry Columns Layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {gallery.map((img, idx) => {
          const { width, height } = img.asset.metadata?.dimensions || { width: 800, height: 1200 };

          return (
            <div
              key={img.asset._id || idx}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid overflow-hidden rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 cursor-pointer relative group bg-zinc-100 dark:bg-zinc-900 transition-all duration-300 hover:shadow-lg"
              style={{
                aspectRatio: `${width} / ${height}`,
              }}
            >
              <Image
                src={img.asset.url}
                alt={img.alt || "Imagen de portafolio"}
                width={width}
                height={height}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
                priority={idx < 4}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs font-light tracking-wide line-clamp-2">
                  {img.alt}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={showPrev}
            className="absolute left-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={showNext}
            className="absolute right-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Lightbox Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
          >
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gallery[selectedIdx].asset.url}
                alt={gallery[selectedIdx].alt}
                className="max-w-full max-h-[80vh] object-contain rounded-sm select-none"
              />
            </div>
            
            {/* Caption */}
            {gallery[selectedIdx].alt && (
              <p className="text-zinc-400 text-sm font-light mt-4 text-center max-w-xl">
                {gallery[selectedIdx].alt}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
