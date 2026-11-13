"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "next-sanity";
import { auth, isAllowedAdminEmail } from "@/auth";
import { apiVersion, dataset, projectId } from "@/lib/sanity.client";
import { GalleryCategory } from "@/lib/types";

const writeToken = process.env.SANITY_API_WRITE_TOKEN;

function getWriteClient() {
  if (!writeToken) {
    throw new Error("SANITY_API_WRITE_TOKEN no está configurado en el servidor.");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
  });
}

async function requireAdmin() {
  const session = await auth();
  const email = session?.user?.email;

  if (!session || !isAllowedAdminEmail(email)) {
    throw new Error("Acceso denegado: Se requieren permisos de administrador.");
  }

  return session;
}

interface RawSanityGalleryItem {
  _key: string;
  _type?: string;
  asset?: {
    _type: string;
    _ref: string;
  };
  alt?: string;
  category?: string;
  isHero?: boolean;
  visible?: boolean;
}

interface RawModelProfileDoc {
  _id: string;
  gallery?: RawSanityGalleryItem[];
}

async function getOrCreateModelProfile(writeClient: ReturnType<typeof getWriteClient>): Promise<RawModelProfileDoc> {
  const existing = await writeClient.fetch<RawModelProfileDoc | null>(
    `*[_type == "modelProfile"][0]{ _id, gallery }`
  );

  if (existing) {
    return existing;
  }

  const created = await writeClient.create({
    _type: "modelProfile",
    name: "Valentina Patri",
    bio: "",
    location: "Buenos Aires, Argentina",
    bookingEmail: "valentinapatri09@gmail.com",
    gallery: [],
  });

  return {
    _id: created._id,
    gallery: [],
  };
}

export interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

const ALLOWED_CATEGORIES: GalleryCategory[] = [
  "Editorial",
  "Comercial",
  "Polaroids",
  "Pasarela",
];

export async function uploadGalleryImageAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();

    const file = formData.get("file");
    const categoryInput = String(formData.get("category") || "Editorial").trim();
    const altInput = String(formData.get("alt") || "").trim();
    const isHeroInput = formData.get("isHero") === "true" || formData.get("isHero") === "on";

    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Por favor selecciona una imagen válida." };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "El archivo debe ser una imagen (JPG, PNG, WEBP, etc.)." };
    }

    const category = ALLOWED_CATEGORIES.includes(categoryInput as GalleryCategory)
      ? categoryInput
      : "Editorial";

    const writeClient = getWriteClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedAsset = await writeClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    const doc = await getOrCreateModelProfile(writeClient);
    const currentGallery = Array.isArray(doc.gallery) ? doc.gallery : [];

    const normalizedGallery = isHeroInput
      ? currentGallery.map((item) => ({ ...item, isHero: false }))
      : currentGallery;

    const newImageItem: RawSanityGalleryItem = {
      _key: crypto.randomUUID(),
      _type: "image",
      asset: {
        _type: "reference",
        _ref: uploadedAsset._id,
      },
      alt: altInput || file.name.replace(/\.[^/.]+$/, ""),
      category,
      isHero: isHeroInput,
      visible: true,
    };

    if (isHeroInput) {
      await writeClient
        .patch(doc._id)
        .set({ gallery: [newImageItem, ...normalizedGallery] })
        .commit();
    } else {
      await writeClient
        .patch(doc._id)
        .setIfMissing({ gallery: [] })
        .insert("before", "gallery[0]", [newImageItem])
        .commit();
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "Fotografía subida correctamente." };
  } catch (error) {
    console.error("[Admin Action] uploadGalleryImageAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al subir la fotografía.",
    };
  }
}

export async function toggleImageVisibilityAction(
  imageKey: string,
  currentVisible: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (!imageKey) {
      return { success: false, error: "Identificador de imagen inválido." };
    }

    const writeClient = getWriteClient();
    const doc = await getOrCreateModelProfile(writeClient);

    await writeClient
      .patch(doc._id)
      .set({ [`gallery[_key=="${imageKey}"].visible`]: !currentVisible })
      .commit();

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message: !currentVisible ? "Fotografía marcada como visible." : "Fotografía ocultada.",
    };
  } catch (error) {
    console.error("[Admin Action] toggleImageVisibilityAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "No se pudo cambiar la visibilidad.",
    };
  }
}

export async function setHeroImageAction(imageKey: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (!imageKey) {
      return { success: false, error: "Identificador de imagen inválido." };
    }

    const writeClient = getWriteClient();
    const doc = await getOrCreateModelProfile(writeClient);
    const currentGallery = Array.isArray(doc.gallery) ? doc.gallery : [];

    const updatedGallery = currentGallery.map((item) => ({
      ...item,
      isHero: item._key === imageKey,
    }));

    await writeClient.patch(doc._id).set({ gallery: updatedGallery }).commit();

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "Portada principal (Hero) actualizada." };
  } catch (error) {
    console.error("[Admin Action] setHeroImageAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "No se pudo actualizar la portada.",
    };
  }
}

export async function updateImageCategoryAction(
  imageKey: string,
  category: string
): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (!imageKey) {
      return { success: false, error: "Identificador de imagen inválido." };
    }

    const validCategory = ALLOWED_CATEGORIES.includes(category as GalleryCategory)
      ? category
      : "Editorial";

    const writeClient = getWriteClient();
    const doc = await getOrCreateModelProfile(writeClient);

    await writeClient
      .patch(doc._id)
      .set({ [`gallery[_key=="${imageKey}"].category`]: validCategory })
      .commit();

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: `Categoría actualizada a ${validCategory}.` };
  } catch (error) {
    console.error("[Admin Action] updateImageCategoryAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "No se pudo cambiar la categoría.",
    };
  }
}

export async function deleteGalleryImageAction(imageKey: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (!imageKey) {
      return { success: false, error: "Identificador de imagen inválido." };
    }

    const writeClient = getWriteClient();
    const doc = await getOrCreateModelProfile(writeClient);

    await writeClient
      .patch(doc._id)
      .unset([`gallery[_key=="${imageKey}"]`])
      .commit();

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "Fotografía eliminada del portafolio." };
  } catch (error) {
    console.error("[Admin Action] deleteGalleryImageAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "No se pudo eliminar la fotografía.",
    };
  }
}

export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();

    const location = String(formData.get("location") || "").trim();
    const bookingEmail = String(formData.get("bookingEmail") || "").trim();
    const instagramUrl = String(formData.get("instagramUrl") || "").trim();

    const stats = {
      height: String(formData.get("height") || "").trim(),
      bust: String(formData.get("bust") || "").trim(),
      waist: String(formData.get("waist") || "").trim(),
      hips: String(formData.get("hips") || "").trim(),
      shoes: String(formData.get("shoes") || "").trim(),
      eyes: String(formData.get("eyes") || "").trim(),
      hair: String(formData.get("hair") || "").trim(),
    };

    const writeClient = getWriteClient();
    const doc = await getOrCreateModelProfile(writeClient);

    await writeClient
      .patch(doc._id)
      .set({
        location,
        bookingEmail,
        instagramUrl,
        stats,
        measurements: stats,
      })
      .commit();

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "Datos del perfil y medidas actualizados." };
  } catch (error) {
    console.error("[Admin Action] updateProfileAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al guardar los datos del perfil.",
    };
  }
}

export async function adminSignOutAction() {
  const { signOut } = await import("@/auth");
  await signOut({ redirectTo: "/admin" });
}

