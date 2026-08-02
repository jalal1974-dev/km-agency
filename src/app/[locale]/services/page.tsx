import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { ServicesPage } from "@/components/public-site";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { fallbackServices } from "@/lib/fallback-data";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (!isSupabaseConfigured()) {
    return <ServicesPage locale={locale} services={fallbackServices} />;
  }
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select("slug,title_ar,title_en,excerpt_ar,excerpt_en,featured,service_categories(name_ar,name_en)")
    .eq("published", true)
    .order("sort_order");
  const services = (data || []).map(service => {
    const category = Array.isArray(service.service_categories) ? service.service_categories[0] : service.service_categories;
    return {
      slug: service.slug,
      titleAr: service.title_ar,
      titleEn: service.title_en,
      excerptAr: service.excerpt_ar,
      excerptEn: service.excerpt_en,
      featured: service.featured,
      category: {
        nameAr: category?.name_ar || "",
        nameEn: category?.name_en || ""
      }
    };
  });
  return <ServicesPage locale={locale} services={services.length ? services : fallbackServices} />;
}
