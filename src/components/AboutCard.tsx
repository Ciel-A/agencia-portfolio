import { Instagram, Mail } from "lucide-react";
import { ModelMeasurements } from "@/lib/types";

interface AboutCardProps {
  bio: string;
  measurements: ModelMeasurements;
}

export default function AboutCard({ bio, measurements }: AboutCardProps) {
  // Mapping labels to bilingual formats for high-end look
  const measurementFields = [
    { label: "Altura", subLabel: "Height", value: measurements.height },
    { label: "Busto", subLabel: "Bust", value: measurements.bust },
    { label: "Cintura", subLabel: "Waist", value: measurements.waist },
    { label: "Cadera", subLabel: "Hips", value: measurements.hips },
    { label: "Zapatos", subLabel: "Shoes", value: measurements.shoes },
    { label: "Ojos", subLabel: "Eyes", value: measurements.eyes },
    { label: "Cabello", subLabel: "Hair", value: measurements.hair },
  ];

  return (
    <section id="about" className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-200/50 dark:border-zinc-800/50">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Biography */}
        <div className="md:col-span-7 space-y-6">
          <span className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold">
            Biografía
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
            Sobre Mí
          </h2>
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 font-light max-w-2xl">
            {bio || "Información biográfica no disponible en este momento."}
          </p>

          {/* Real Contact Buttons */}
          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href="mailto:valentinapatri09@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs uppercase tracking-widest font-semibold hover:bg-transparent dark:hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 shadow-sm active:scale-95"
            >
              <Mail className="w-4 h-4" />
              Contactar por Email
            </a>
            <a
              href="https://www.instagram.com/val_patri/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-55 text-xs uppercase tracking-widest font-semibold transition-all duration-300 active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </div>
        </div>

        {/* Right Column: Measurements Card */}
        <div className="md:col-span-5">
          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 md:p-8 space-y-6 shadow-xs">
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold">
              Perfil & Medidas
            </h3>
            
            <div className="divide-y divide-zinc-200/55 dark:divide-zinc-800/55">
              {measurementFields.map((field, idx) => (
                <div 
                  key={idx} 
                  className="py-3 flex items-center justify-between text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {field.label}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      {field.subLabel}
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-950 dark:text-zinc-50 text-right">
                    {field.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
