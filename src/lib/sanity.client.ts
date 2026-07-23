import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "bvry2bqu";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-10";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // 👈 Forzamos a consultar la API directa para traer datos actualizados en el build
  token: process.env.SANITY_API_READ_TOKEN, // 👈 Se conecta de forma autenticada si la variable existe
});