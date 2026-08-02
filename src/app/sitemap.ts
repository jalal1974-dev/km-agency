import type { MetadataRoute } from "next";
import { fallbackServices } from "@/lib/fallback-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kmagency.online";
  const staticRoutes = ["", "/ar", "/en", "/ar/services", "/en/services"];
  const serviceRoutes = fallbackServices.flatMap(service => [`/ar/services/${service.slug}`, `/en/services/${service.slug}`]);

  return [...staticRoutes, ...serviceRoutes].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-08-01"),
    changeFrequency: route.includes("/services/") ? "monthly" : "weekly",
    priority: route === "" || route === "/ar" || route === "/en" ? 1 : 0.8
  }));
}
