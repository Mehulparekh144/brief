import type { MetadataRoute } from "next";
import { SITE } from "@/lib/format.ts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE}/`, changeFrequency: "weekly", priority: 1 }];
}
