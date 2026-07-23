import Header from "@/components/Header";
import MasonryGallery from "@/components/MasonryGallery";
import AboutCard from "@/components/AboutCard";
import Footer from "@/components/Footer";
import { client } from "@/lib/sanity.client";
import { MOCK_MODEL_DATA } from "@/lib/mockData";
import { ModelProfile } from "@/lib/types";

// Optimized GROQ Query fetching dimension metadata to prevent CLS
const MODEL_QUERY = `
  *[_type == "modelProfile"][0] {
    name,
    measurements {
      height,
      bust,
      waist,
      hips,
      shoes,
      eyes,
      hair
    },
    bio,
    gallery[] {
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
      alt
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
    // Fetch data with next-sanity client (revalidate: 60s for incremental builds)
    const data = await client.fetch<ModelProfile | null>(
      MODEL_QUERY, 
      {}, 
      { next: { revalidate: 60 } }
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

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Sticky Header */}
      <Header modelName={modelData.name} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Elegant Hero Section */}
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
          
          <div className="mt-8 flex items-center justify-center">
            <a
              href="#gallery"
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest font-semibold border border-zinc-900 dark:border-zinc-100 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950 transition-all duration-300 rounded-full shadow-xs active:scale-95"
            >
              Ver Portafolio
            </a>
          </div>
        </section>

        {/* Portfolio Masonry Gallery */}
        <MasonryGallery gallery={modelData.gallery} />

        {/* Biography & Measurements Card */}
        <AboutCard bio={modelData.bio} measurements={modelData.measurements} />
      </main>

      {/* Footer */}
      <Footer modelName={modelData.name} />
    </div>
  );
}
