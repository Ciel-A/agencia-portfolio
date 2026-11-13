import { Instagram, Mail, MapPin, FileDown } from "lucide-react";
import { ModelMeasurements } from "@/lib/types";

interface AboutCardProps {
  bio: string;
  stats?: ModelMeasurements;
  measurements?: ModelMeasurements;
  location?: string;
  bookingEmail?: string;
  instagramUrl?: string;
  compCardUrl?: string | null;
}

export default function AboutCard({
  bio,
  stats,
  measurements,
  location,
  bookingEmail,
  instagramUrl,
  compCardUrl,
}: AboutCardProps) {
  // Dynamic stats with field-by-field fallback to measurements for maximum reliability
  const getStat = (key: keyof ModelMeasurements) => {
    return stats?.[key] || measurements?.[key] || "-";
  };
  const effectiveLocation = location || "Buenos Aires, Argentina";
  const emailContact = bookingEmail || "valentinapatri09@gmail.com";
  const instagramContact = instagramUrl || "https://www.instagram.com/val_patri/";

  // Mapping labels to bilingual formats for high-end look
  const measurementFields = [
    { label: "Altura", subLabel: "Height", value: getStat("height") },
    { label: "Busto", subLabel: "Bust", value: getStat("bust") },
    { label: "Cintura", subLabel: "Waist", value: getStat("waist") },
    { label: "Cadera", subLabel: "Hips", value: getStat("hips") },
    { label: "Zapatos", subLabel: "Shoes", value: getStat("shoes") },
    { label: "Ojos", subLabel: "Eyes", value: getStat("eyes") },
    { label: "Cabello", subLabel: "Hair", value: getStat("hair") },
  ];

  return (
    <section id="about" className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-200/50 dark:border-zinc-800/50">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Biography */}
        <div className="md:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold">
              Biografía
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <div className="flex items-center gap-1.5 text-xs tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{effectiveLocation}</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
            Sobre Mí
          </h2>
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 font-light max-w-2xl">
            {bio || "Información biográfica no disponible en este momento."}
          </p>

          {/* Contact & Comp Card Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href={`mailto:${emailContact}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs uppercase tracking-widest font-semibold hover:bg-transparent dark:hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 shadow-sm active:scale-95"
            >
              <Mail className="w-4 h-4" />
              Contactar por Email
            </a>
            <a
              href={instagramContact}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 text-xs uppercase tracking-widest font-semibold transition-all duration-300 active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>

            {/* Comp Card Download Button - Only rendered if PDF was uploaded to Sanity */}
            {compCardUrl && (
              <a
                href={compCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-900/80 dark:border-zinc-100/80 bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-900 dark:hover:bg-zinc-100 text-zinc-900 dark:text-zinc-100 hover:text-white dark:hover:text-zinc-950 text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xs active:scale-95"
              >
                <FileDown className="w-4 h-4" />
                Descargar Comp Card (PDF)
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Measurements Card */}
        <div className="md:col-span-5">
          <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold">
                  Perfil & Medidas
                </h3>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                  Stats & Measurements
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-full">
                <MapPin className="w-3 h-3 text-zinc-400" />
                <span>{effectiveLocation}</span>
              </div>
            </div>

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

            {/* Bottom Card Action: Comp Card */}
            {compCardUrl && (
              <div className="pt-2">
                <a
                  href={compCardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-950 text-xs uppercase tracking-widest font-semibold transition-all duration-200 active:scale-[0.99]"
                >
                  <FileDown className="w-4 h-4" />
                  Descargar Comp Card (PDF)
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
