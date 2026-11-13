import { ModelProfile } from "./types";

export const MOCK_MODEL_DATA: ModelProfile = {
  name: "Alessandra Vanni",
  bio: "Alessandra es una modelo profesional con más de 6 años de experiencia en pasarelas internacionales y campañas editoriales de alta costura. Basada entre Milán y Buenos Aires, ha trabajado con marcas de renombre mundial, destacándose por su versatilidad, elegancia y fuerte presencia escénica.",
  location: "Buenos Aires, Argentina",
  bookingEmail: "valentinapatri09@gmail.com",
  instagramUrl: "https://www.instagram.com/val_patri/",
  compCardUrl: "/comp-card-sample.pdf",
  stats: {
    height: "178 cm",
    bust: "85 cm",
    waist: "60 cm",
    hips: "89 cm",
    shoes: "39",
    eyes: "Verde Esmeralda",
    hair: "Castaño Claro",
  },
  measurements: {
    height: "178 cm",
    bust: "85 cm",
    waist: "60 cm",
    hips: "89 cm",
    shoes: "39",
    eyes: "Verde Esmeralda",
    hair: "Castaño Claro",
  },
  gallery: [
    {
      asset: {
        _id: "mock-img-1",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
        metadata: {
          dimensions: {
            width: 1000,
            height: 1333,
            aspectRatio: 0.75,
          },
        },
      },
      alt: "Retrato primer plano de Alessandra Vanni",
      category: "Editorial",
      isHero: true,
      visible: true,
    },
    {
      asset: {
        _id: "mock-img-2",
        url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop",
        metadata: {
          dimensions: {
            width: 1000,
            height: 1500,
            aspectRatio: 0.67,
          },
        },
      },
      alt: "Campaña editorial al aire libre, vestido de verano",
      category: "Comercial",
      isHero: false,
      visible: true,
    },
    {
      asset: {
        _id: "mock-img-3",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop",
        metadata: {
          dimensions: {
            width: 1000,
            height: 1498,
            aspectRatio: 0.667,
          },
        },
      },
      alt: "Sesión de fotos casual urbana",
      category: "Polaroids",
      isHero: false,
      visible: true,
    },
    {
      asset: {
        _id: "mock-img-4",
        url: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1000&auto=format&fit=crop",
        metadata: {
          dimensions: {
            width: 1000,
            height: 1250,
            aspectRatio: 0.8,
          },
        },
      },
      alt: "Retrato de perfil con luz natural",
      category: "Editorial",
      isHero: false,
      visible: true,
    },
    {
      asset: {
        _id: "mock-img-5",
        url: "https://images.unsplash.com/photo-1496440737103-cd596325d314?q=80&w=1000&auto=format&fit=crop",
        metadata: {
          dimensions: {
            width: 1000,
            height: 1499,
            aspectRatio: 0.667,
          },
        },
      },
      alt: "Fotografía editorial de moda en blanco y negro",
      category: "Pasarela",
      isHero: false,
      visible: true,
    },
    {
      asset: {
        _id: "mock-img-6",
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        metadata: {
          dimensions: {
            width: 1000,
            height: 1500,
            aspectRatio: 0.667,
          },
        },
      },
      alt: "Posado editorial de alta costura con fondo amarillo",
      category: "Comercial",
      isHero: false,
      visible: true,
    },
    {
      asset: {
        _id: "mock-img-7",
        url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1000&auto=format&fit=crop",
        metadata: {
          dimensions: {
            width: 1000,
            height: 1500,
            aspectRatio: 0.667,
          },
        },
      },
      alt: "Retrato expresivo estudio fotográfico",
      category: "Polaroids",
      isHero: false,
      visible: true,
    },
  ],
};
