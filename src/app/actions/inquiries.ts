"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { Locale } from "@/lib/i18n";
import { sendThankYouEmail } from "@/lib/email";
import { getFallbackService } from "@/lib/fallback-data";
import { saveLocalInquiry } from "@/lib/local-inquiries";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

const inquirySchema = z.object({
  locale: z.enum(["ar", "en"]),
  serviceSlug: z.string().min(1),
  fullName: z.string().min(2),
  company: z.string().optional(),
  phone: z.string().min(6),
  whatsapp: z.string().optional(),
  email: z.string().email(),
  country: z.string().optional(),
  budget: z.string().min(1)
});

export async function submitInquiry(formData: FormData) {
  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error("Please complete the required inquiry fields.");
  }

  const reference = `KM-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  if (!isSupabaseConfigured()) {
    const fallbackService = getFallbackService(parsed.data.serviceSlug);
    const serviceName = parsed.data.locale === "ar" ? fallbackService?.titleAr || parsed.data.serviceSlug : fallbackService?.titleEn || parsed.data.serviceSlug;
    const emailStatus = await sendThankYouEmail({
      to: parsed.data.email,
      name: parsed.data.fullName,
      reference,
      serviceName,
      locale: parsed.data.locale
    });

    await saveLocalInquiry({
      id: reference,
      reference,
      status: "new",
      name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      budget: parsed.data.budget || null,
      created_at: new Date().toISOString(),
      email_status: emailStatus,
      services: {
        title_en: fallbackService?.titleEn || parsed.data.serviceSlug,
        title_ar: fallbackService?.titleAr || parsed.data.serviceSlug
      }
    });

    redirect(`/${parsed.data.locale}/services/${parsed.data.serviceSlug}?sent=${reference}&email=${emailStatus}`);
  }

  const supabase = createSupabaseServiceClient();
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id, slug, title_ar, title_en, form_schemas(id, form_fields(id, key, type, label_ar, label_en, required))")
    .eq("slug", parsed.data.serviceSlug)
    .eq("form_schemas.active", true)
    .eq("form_schemas.form_fields.active", true)
    .single();

  if (serviceError || !service) {
    const fallbackService = getFallbackService(parsed.data.serviceSlug);
    if (fallbackService) {
      const emailStatus = await sendThankYouEmail({
        to: parsed.data.email,
        name: parsed.data.fullName,
        reference,
        serviceName: parsed.data.locale === "ar" ? fallbackService.titleAr : fallbackService.titleEn,
        locale: parsed.data.locale
      });
      await saveLocalInquiry({
        id: reference,
        reference,
        status: "new",
        name: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        budget: parsed.data.budget || null,
        created_at: new Date().toISOString(),
        email_status: emailStatus,
        services: { title_en: fallbackService.titleEn, title_ar: fallbackService.titleAr }
      });
      redirect(`/${parsed.data.locale}/services/${parsed.data.serviceSlug}?sent=${reference}&email=${emailStatus}`);
    }
    throw new Error("Service not found.");
  }

  const activeSchema = service.form_schemas?.[0];
  const fields = activeSchema?.form_fields || [];

  const { data: inquiry, error: inquiryError } = await supabase
    .from("inquiries")
    .insert({
      reference,
      service_id: service.id,
      form_schema_id: activeSchema?.id || null,
      locale: parsed.data.locale,
      name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      whatsapp: parsed.data.whatsapp || null,
      company: parsed.data.company || null,
      country: parsed.data.country || null,
      budget: parsed.data.budget || null
    })
    .select("id")
    .single();

  if (inquiryError || !inquiry) throw new Error("Could not save inquiry.");

  const answers = fields
    .map(field => {
      const value = String(formData.get(field.key) || "");
      if (!value) return null;
      return {
        inquiry_id: inquiry.id,
        field_id: field.id,
        field_key: field.key,
        field_label: parsed.data.locale === "ar" ? field.label_ar : field.label_en,
        field_type: field.type,
        value,
        display_value: value,
        locale: parsed.data.locale as Locale
      };
    })
    .filter((answer): answer is {
      inquiry_id: string;
      field_id: string;
      field_key: string;
      field_label: string;
      field_type: string;
      value: string;
      display_value: string;
      locale: Locale;
    } => Boolean(answer));

  if (answers.length) {
    const { error: answersError } = await supabase.from("inquiry_answers").insert(answers);
    if (answersError) throw new Error("Could not save inquiry answers.");
  }

  const serviceName = parsed.data.locale === "ar" ? service.title_ar || service.slug : service.title_en || service.slug;
  const emailStatus = await sendThankYouEmail({
    to: parsed.data.email,
    name: parsed.data.fullName,
    reference,
    serviceName,
    locale: parsed.data.locale
  });

  redirect(`/${parsed.data.locale}/services/${service.slug}?sent=${reference}&email=${emailStatus}`);
}
