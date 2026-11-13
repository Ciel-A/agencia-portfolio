"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ModelImage } from "@/lib/types";

const CATEGORIES = ["Todas", "Editorial", "Comercial", "Polaroids", "Pasarela"] as const;

interface MasonryGalleryProps {
  gallery: ModelImage[];
}

export default function MasonryGallery({ gallery }: MasonryGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Todas");

  // Filter gallery dynamically based on the selected category
  const filteredGallery = useMemo(() => {
    if (!gallery) return [];
    if (activeCategory === "Todas") return gallery;
    return gallery.filter(
      (img) => img.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [gallery, activeCategory]);

  const openLightbox = (index: number) => {
    setSelectedIdx(index);
  };

  const closeLightbox = () => {
    setSelectedIdx(null);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null || filteredGallery.length === 0) return;
    setSelectedIdx((selectedIdx + 1) % filteredGallery.length);
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null || filteredGallery.length === 0) return;
    setSelectedIdx((selectedIdx - 1 + filteredGallery.length) % filteredGallery.length);
  };

  return (
    <section id="gallery" className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header & Minimalist Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">
            Galería Selecta
          </span>
          <h2 className="text-2xl font-bold tracking-tight uppercase text-zinc-900 dark:text-zinc-50">
            Portafolio
          </h2>
        </div>

        {/* Minimalist Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            const count =
              category === "Todas"
                ? gallery?.length || 0
                : gallery?.filter((img) => img.category?.toLowerCase() === category.toLowerCase()).length || 0;

            return (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSelectedIdx(null); // Reset lightbox on tab change
                }}
                className={`relative px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full transition-all duration-300 cursor-pointer select-none whitespace-nowrap active:scale-95 ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100/70 dark:bg-zinc-900/60 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70"
                }`}
                aria-pressed={isActive}
              >
                <span>{category}</span>
                {count > 0 && (
                  <span
                    className={`ml-1.5 text-[10px] font-mono ${
                      isActive ? "opacity-80" : "opacity-45"
                    }`}
                  >
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredGallery.length === 0 ? (
        <div className="w-full text-center py-20 px-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light">
            No hay fotografías disponibles en la categoría{" "}
            <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
              &quot;{activeCategory}&quot;
            </strong>
            .
          </p>
          <button
            onClick={() => setActiveCategory("Todas")}
            className="mt-4 px-4 py-2 text-xs uppercase tracking-widest font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            Ver Todas las Fotografías
          </button>
        </div>
      ) : (
        /* Masonry Columns Layout */
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredGallery.map((img, idx) => {
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

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.category ? (
                    <span className="text-[10px] uppercase tracking-wider font-semibold bg-black/60 text-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                      {img.category}
                    </span>
                  ) : <span />}

                  {img.isHero && (
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold bg-amber-500/90 text-white backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Portada
                    </span>
                  )}
                </div>

                {/* Bottom Caption Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-xs font-light tracking-wide line-clamp-2">
                    {img.alt || (img.category ? `Fotografía ${img.category}` : "Fotografía de portafolio")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedIdx !== null && filteredGallery[selectedIdx] && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons (shown only if more than 1 image in filtered view) */}
          {filteredGallery.length > 1 && (
            <>
              <button
                onClick={showPrev}
                className="absolute left-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                onClick={showNext}
                className="absolute right-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Lightbox Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
          >
            <div className="relative w-full h-full flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filteredGallery[selectedIdx].asset.url}
                alt={filteredGallery[selectedIdx].alt || "Fotografía de portafolio"}
                className="max-w-full max-h-[75vh] object-contain rounded-sm select-none"
              />
            </div>

            {/* Lightbox Info Bar */}
            <div className="mt-4 flex flex-col items-center gap-1.5 text-center max-w-xl">
              <div className="flex items-center gap-2">
                {filteredGallery[selectedIdx].category && (
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                    {filteredGallery[selectedIdx].category}
                  </span>
                )}
                {filteredGallery[selectedIdx].isHero && (
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    Portada
                  </span>
                )}
                <span className="text-[11px] font-mono text-zinc-400">
                  {selectedIdx + 1} / {filteredGallery.length}
                </span>
              </div>

              {filteredGallery[selectedIdx].alt && (
                <p className="text-zinc-300 text-sm font-light">
                  {filteredGallery[selectedIdx].alt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
