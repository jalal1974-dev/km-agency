import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { ServiceDetailPage } from "@/components/service-detail";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getFallbackService } from "@/lib/fallback-data";

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ sent?: string; email?: string }>;
}) {
  const { locale, slug } = await params;
  const { sent, email } = await searchParams;
  if (!isLocale(locale)) notFound();
  if (!isSupabaseConfigured()) {
    return <ServiceDetailPage locale={locale} service={getFallbackService(slug)} sentReference={sent} emailStatus={email} />;
  }
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select("slug,title_ar,title_en,excerpt_ar,excerpt_en,description_ar,description_en,starting_price,timeline,service_categories(name_ar,name_en),service_benefits(text_ar,text_en),service_deliverables(text_ar,text_en),form_schemas(id,form_fields(key,type,label_ar,label_en,placeholder_ar,placeholder_en,required,options))")
    .eq("slug", slug)
    .eq("published", true)
    .eq("form_schemas.active", true)
    .eq("form_schemas.form_fields.active", true)
    .single();
  const category = data ? (Array.isArray(data.service_categories) ? data.service_categories[0] : data.service_categories) : null;
  const service = data
    ? {
        slug: data.slug,
        titleAr: data.title_ar,
        titleEn: data.title_en,
        excerptAr: data.excerpt_ar,
        excerptEn: data.excerpt_en,
        descriptionAr: data.description_ar,
        descriptionEn: data.description_en,
        startingPrice: data.starting_price,
        timeline: data.timeline,
        category: {
          nameAr: category?.name_ar || "",
          nameEn: category?.name_en || ""
        },
        benefits: (data.service_benefits || []).map(item => ({ textAr: item.text_ar, textEn: item.text_en })),
        deliverables: (data.service_deliverables || []).map(item => ({ textAr: item.text_ar, textEn: item.text_en })),
        formSchemas: (data.form_schemas || []).map(schema => ({
          fields: (schema.form_fields || []).map(field => ({
            key: field.key,
            type: field.type,
            labelAr: field.label_ar,
            labelEn: field.label_en,
            placeholderAr: field.placeholder_ar,
            placeholderEn: field.placeholder_en,
            required: field.required,
            optionsJson: Array.isArray(field.options) ? field.options.join("|") : null
          }))
        }))
      }
    : null;
  return <ServiceDetailPage locale={locale} service={service || getFallbackService(slug)} sentReference={sent} emailStatus={email} />;
}
