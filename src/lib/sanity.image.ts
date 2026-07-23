import imageUrlBuilder from "@sanity/image-url";
import { client } from "./sanity.client";

// Initialize image builder only if client is configured.
const builder = client ? imageUrlBuilder(client) : null;

/**
 * Helper to build optimized image URLs from Sanity image assets.
 * Falls back to return the source URL if Sanity is not initialized.
 */
export function urlFor(source: any) {
  if (!builder) {
    return {
      width: () => ({
        url: () => typeof source === "string" ? source : (source?.asset?.url || "")
      }),
      url: () => typeof source === "string" ? source : (source?.asset?.url || "")
    };
  }
  return builder.image(source);
}
