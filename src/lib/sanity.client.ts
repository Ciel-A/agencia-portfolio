import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "bvry2bqu";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-10";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Forzamos fetch directo sin caché
});