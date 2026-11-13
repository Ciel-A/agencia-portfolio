import imageUrlBuilder from "@sanity/image-url";
import { client } from "./sanity.client";

// Initialize image builder only if client is configured.
const builder = client ? imageUrlBuilder(client) : null;

type ImageSource =
  | Parameters<NonNullable<typeof builder>["image"]>[0]
  | { asset?: { url?: string; _id?: string } };

/**
 * Helper to build optimized image URLs from Sanity image assets.
 * Falls back to return the source URL if Sanity is not initialized.
 */
export function urlFor(source: ImageSource) {
  if (!builder) {
    const extractUrl = () => {
      if (typeof source === "string") return source;
      if (
        source &&
        typeof source === "object" &&
        "asset" in source &&
        source.asset &&
        typeof source.asset === "object" &&
        "url" in source.asset
      ) {
        return (source.asset as { url?: string }).url || "";
      }
      return "";
    };

    const fallbackUrl = extractUrl();
    return {
      width: () => ({
        url: () => fallbackUrl,
      }),
      url: () => fallbackUrl,
    };
  }
  return builder.image(source);
}
