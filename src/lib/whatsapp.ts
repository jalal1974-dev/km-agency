import type { Locale } from "@/lib/i18n";

export function whatsappUrl(serviceName: string, locale: Locale, reference?: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "962777066779";
  const text =
    locale === "ar"
      ? `مرحبا KM Agency، أنا مهتم بخدمة ${serviceName}${reference ? `، رقم الطلب ${reference}` : ""}. أرغب بمناقشة مشروعي.`
      : `Hello KM Agency, I am interested in the ${serviceName} service${reference ? `, inquiry ${reference}` : ""}. I would like to discuss my project.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
