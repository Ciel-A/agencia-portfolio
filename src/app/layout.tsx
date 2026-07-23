import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valentina Patri | Portfolio",
  description: "Portafolio profesional de modelaje y booking.",
  metadataBase: new URL("https://agencia-portfolio-flame.vercel.app"),
  openGraph: {
    title: "Valentina Patri | Portfolio",
    description: "Portafolio profesional de modelaje y booking.",
    url: "https://agencia-portfolio-flame.vercel.app",
    siteName: "Valentina Patri",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Valentina Patri Portfolio",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}