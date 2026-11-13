export interface ModelMeasurements {
  height?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoes?: string;
  eyes?: string;
  hair?: string;
}

export type GalleryCategory = "Editorial" | "Comercial" | "Polaroids" | "Pasarela";

export interface SanityImageAsset {
  _id?: string;
  url: string;
  metadata?: {
    dimensions: {
      width: number;
      height: number;
      aspectRatio: number;
    };
  };
}

export interface ModelImage {
  _key?: string;
  asset: SanityImageAsset;
  alt: string;
  category?: GalleryCategory | string;
  isHero?: boolean;
  visible?: boolean;
}

export interface ModelProfile {
  _id?: string;
  name: string;
  bio: string;
  location?: string;
  bookingEmail?: string;
  instagramUrl?: string;
  compCardUrl?: string | null;
  stats?: ModelMeasurements;
  measurements?: ModelMeasurements;
  gallery: ModelImage[];
}

