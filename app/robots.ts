import type { MetadataRoute } from "next";
import { SITE } from "@/lib/format.ts";

// Only the landing page is public. Private pages also require sign-in; robots.txt just saves crawl time.
// AI crawlers are treated like search crawlers: the landing page is marketing, so being cited is good.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/auth/", "/s/", "/challenges", "/me", "/admin", "/waitlist"] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
