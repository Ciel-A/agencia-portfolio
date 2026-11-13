import Image from "next/image";
import { FileDown, MapPin, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import MasonryGallery from "@/components/MasonryGallery";
import AboutCard from "@/components/AboutCard";
import Footer from "@/components/Footer";
import { client } from "@/lib/sanity.client";
import { MOCK_MODEL_DATA } from "@/lib/mockData";
import { ModelProfile } from "@/lib/types";

// Ensure rapid revalidation so changes published in Sanity Studio reflect within seconds
export const revalidate = 10;

// Optimized GROQ Query fetching dimension metadata, new profile fields, and filtered gallery
const MODEL_QUERY = `
  *[_type == "modelProfile"][0] {
    name,
    bio,
    location,
    bookingEmail,
    instagramUrl,
    "compCardUrl": compCard.asset->url,
    stats {
      height,
      bust,
      waist,
      hips,
      shoes,
      eyes,
      hair
    },
    measurements {
      height,
      bust,
      waist,
      hips,
      shoes,
      eyes,
      hair
    },
    "gallery": gallery[visible != false] {
      _key,
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      alt,
      category,
      isHero,
      visible
    }
  }
`;

async function getModelData(): Promise<ModelProfile> {
  if (!client) {
    // Elegant fallback warning on server console
    console.log("\x1b[33m%s\x1b[0m", "[Agencia Portfolio] Info: Sanity Client is not configured. Rendering with mock data fallback.");
    return MOCK_MODEL_DATA;
  }

  try {
    // Fetch data with next-sanity client (revalidate: 10s for near-instant updates)
    const data = await client.fetch<ModelProfile | null>(
      MODEL_QUERY, 
      {}, 
      { next: { revalidate: 10 } }
    );
    
    if (!data) {
      console.warn("[Agencia Portfolio] Warning: Sanity query executed but returned no profile document of type 'modelProfile'. Using mock data.");
      return MOCK_MODEL_DATA;
    }
    
    return data;
  } catch (error) {
    console.error("[Agencia Portfolio] Error: Sanity fetch failed. Falling back to mock data.", error);
    return MOCK_MODEL_DATA;
  }
}

export default async function Page() {
  const modelData = await getModelData();
  const heroImage = modelData.gallery?.find((img) => img.isHero);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Sticky Header */}
      <Header
        modelName={modelData.name}
        bookingEmail={modelData.bookingEmail}
        instagramUrl={modelData.instagramUrl}
      />

      {/* Main Content */}
      <main className="flex-1">
        {heroImage ? (
          /* Editorial Hero Section with Featured isHero Image */
          <section className="relative overflow-hidden py-16 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Background subtle glowing indicator */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-zinc-200/25 dark:bg-zinc-800/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
              {/* Left Column: Headlines & Call to Actions */}
              <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold">
                    Book Profesional
                  </span>
                  {modelData.location && (
                    <>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="inline-flex items-center gap-1 text-xs tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {modelData.location}
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase mb-6 bg-clip-text text-zinc-950 dark:text-zinc-50 leading-[0.95]">
                  {modelData.name}
                </h1>

                <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-lg font-light tracking-wide uppercase mb-8">
                  Modelaje de Alta Costura • Editorial • Internacional
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <a
                    href="#gallery"
                    className="inline-flex items-center justify-center px-7 py-3 text-xs uppercase tracking-widest font-semibold border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-transparent dark:hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 rounded-full shadow-sm active:scale-95"
                  >
                    Ver Portafolio
                  </a>

                  {modelData.compCardUrl && (
                    <a
                      href={modelData.compCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 transition-all duration-300 rounded-full shadow-xs active:scale-95 bg-white/50 dark:bg-zinc-900/40"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Descargar Comp Card (PDF)</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Hero Cover Photo */}
              <div className="md:col-span-5 flex justify-center">
                <a
                  href="#gallery"
                  className="group relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-100 dark:bg-zinc-900 shadow-xl transition-all duration-500 hover:shadow-2xl"
                  title="Ver en la galería"
                >
                  <Image
                    src={heroImage.asset.url}
                    alt={heroImage.alt || `Portada de ${modelData.name}`}
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    priority
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-black/60 text-white/95 backdrop-blur-md border border-white/10 shadow-xs">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Portada Principal
                    </span>
                  </div>

                  {/* Bottom Vignette & Caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex items-end p-6">
                    <p className="text-white text-xs font-light tracking-wide line-clamp-1">
                      {heroImage.alt || modelData.name}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </section>
        ) : (
          /* Default Minimalist Typographic Hero (Fallback when no photo has isHero == true) */
          <section className="relative overflow-hidden py-24 md:py-36 flex flex-col justify-center items-center text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Background subtle glowing indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-zinc-200/20 dark:bg-zinc-800/10 rounded-full blur-[80px] pointer-events-none" />

            <span className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold mb-3">
              Book Profesional
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter uppercase mb-6 bg-clip-text text-zinc-950 dark:text-zinc-50">
              {modelData.name}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md font-light tracking-wide uppercase">
              Modelaje de Alta Costura • Editorial • Internacional
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-4">
              <a
                href="#gallery"
                className="inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest font-semibold border border-zinc-900 dark:border-zinc-100 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950 transition-all duration-300 rounded-full shadow-xs active:scale-95"
              >
                Ver Portafolio
              </a>
              {modelData.compCardUrl && (
                <a
                  href={modelData.compCardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest font-semibold border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 transition-all duration-300 rounded-full shadow-xs active:scale-95"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Descargar Comp Card (PDF)</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Portfolio Masonry Gallery with Dynamic Category Tabs */}
        <MasonryGallery gallery={modelData.gallery} />

        {/* Biography, Measurements (Stats), Location & Comp Card */}
        <AboutCard
          bio={modelData.bio}
          stats={modelData.stats}
          measurements={modelData.measurements}
          location={modelData.location}
          bookingEmail={modelData.bookingEmail}
          instagramUrl={modelData.instagramUrl}
          compCardUrl={modelData.compCardUrl}
        />
      </main>

      {/* Footer */}
      <Footer
        modelName={modelData.name}
        location={modelData.location}
        bookingEmail={modelData.bookingEmail}
        instagramUrl={modelData.instagramUrl}
      />
    </div>
  );
}
