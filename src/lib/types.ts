export interface ModelMeasurements {
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoes: string;
  eyes: string;
  hair: string;
}

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
  asset: SanityImageAsset;
  alt: string;
}

export interface ModelProfile {
  name: string;
  bio: string;
  measurements: ModelMeasurements;
  gallery: ModelImage[];
}
