import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valentina Patri | Portfolio",
  description: "Portafolio profesional de modelaje y booking.",
  metadataBase: new URL("https://agencia-portfolio-flame.vercel.app"), // Usá la URL de tu proyecto
  openGraph: {
    title: "Valentina Patri | Portfolio",
    description: "Portafolio profesional de modelaje y booking.",
    url: "https://agencia-portfolio-flame.vercel.app",
    siteName: "Valentina Patri",
    images: [
      {
        url: "/og-image.jpg", // Busca la imagen que pusiste en la carpeta public
        width: 1200,
        height: 630,
        alt: "Valentina Patri Portfolio",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
};