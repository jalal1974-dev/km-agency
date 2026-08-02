import { notFound } from "next/navigation";
import { submitInquiry } from "@/app/actions/inquiries";
import { Header } from "@/components/public-site";
import { ButtonLink, SectionHeader } from "@/components/ui";
import { dictionary, type Locale } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/whatsapp";

type ServiceDetail = {
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  descriptionAr: string;
  descriptionEn: string;
  timeline: string | null;
  startingPrice: string | null;
  category: { nameAr: string; nameEn: string };
  benefits: { textAr: string; textEn: string }[];
  deliverables: { textAr: string; textEn: string }[];
  formSchemas: {
    fields: {
      key: string;
      type: string;
      labelAr: string;
      labelEn: string;
      placeholderAr: string | null;
      placeholderEn: string | null;
      required: boolean;
      optionsJson: string | null;
    }[];
  }[];
};

function localized(locale: Locale, ar: string, en: string) {
  return locale === "ar" ? ar : en;
}

function inputType(type: string) {
  if (type === "phone") return "tel";
  if (type === "budget") return "text";
  return ["email", "number", "url", "date"].includes(type) ? type : "text";
}

function Field({ field, locale }: { field: ServiceDetail["formSchemas"][number]["fields"][number]; locale: Locale }) {
  const label = localized(locale, field.labelAr, field.labelEn);
  const placeholder = localized(locale, field.placeholderAr || "", field.placeholderEn || "");
  const required = field.required;
  if (field.type === "textarea") {
    return (
      <label className="grid gap-2 md:col-span-2">
        <span className="text-sm font-black">{label}</span>
        <textarea name={field.key} required={required} placeholder={placeholder} className="min-h-32 rounded-ui border border-line bg-white px-3 py-3 focus-ring" />
      </label>
    );
  }
  if (field.type === "select" || field.type === "budget") {
    const options = field.type === "budget" ? "Under 500 JOD|500 - 1500 JOD|1500 - 5000 JOD|5000+ JOD|Not sure" : field.optionsJson || "";
    return (
      <label className="grid gap-2">
        <span className="text-sm font-black">{label}</span>
        <select name={field.key} required={required} className="rounded-ui border border-line bg-white px-3 py-3 focus-ring">
          <option value="">{locale === "ar" ? "اختر" : "Select"}</option>
          {options.split("|").filter(Boolean).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black">{label}</span>
      <input name={field.key} type={inputType(field.type)} required={required} placeholder={placeholder} className="rounded-ui border border-line bg-white px-3 py-3 focus-ring" />
    </label>
  );
}

export function ServiceDetailPage({
  locale,
  service,
  sentReference,
  emailStatus
}: {
  locale: Locale;
  service: ServiceDetail | null;
  sentReference?: string;
  emailStatus?: string;
}) {
  if (!service) notFound();
  const t = dictionary[locale];
  const title = localized(locale, service.titleAr, service.titleEn);
  const fields = service.formSchemas[0]?.fields || [];

  return (
    <>
      <Header locale={locale} />
      <main>
        <section className="bg-[#0E1836] py-20 text-white">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">{localized(locale, service.category.nameAr, service.category.nameEn)}</span>
              <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">{title}</h1>
              <p className="mt-6 max-w-2xl text-lg text-white/75">{localized(locale, service.descriptionAr, service.descriptionEn)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#inquiry" className="inline-flex min-h-11 items-center justify-center rounded-ui bg-brand-600 px-4 py-2.5 text-sm font-bold text-white">{t.startProject}</a>
                <ButtonLink href={whatsappUrl(title, locale)} variant="whatsapp">{t.whatsapp}</ButtonLink>
              </div>
            </div>
            <div className="rounded-ui border border-white/12 bg-white/8 p-6">
              <h2 className="text-2xl font-black">{locale === "ar" ? "ماذا تشمل الخدمة؟" : "What is included?"}</h2>
              <div className="mt-5 grid gap-3">
                {(service.deliverables.length ? service.deliverables : [
                  { textAr: "تحليل المتطلبات", textEn: "Requirements analysis" },
                  { textAr: "تصميم وتنفيذ احترافي", textEn: "Professional design and execution" },
                  { textAr: "تسليم قابل للإدارة", textEn: "Manageable handoff" }
                ]).map(item => (
                  <div key={localized(locale, item.textAr, item.textEn)} className="rounded-ui bg-white/10 p-3 text-white/86">{localized(locale, item.textAr, item.textEn)}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 md:grid-cols-3">
            {[
              [locale === "ar" ? "الفوائد" : "Benefits", service.benefits.length ? service.benefits : [{ textAr: "تحسين الثقة والتحويل", textEn: "Improve trust and conversion" }]],
              [locale === "ar" ? "المدة" : "Timeline", [{ textAr: service.timeline || "حسب نطاق العمل", textEn: service.timeline || "Based on scope" }]],
              [locale === "ar" ? "السعر" : "Price", [{ textAr: service.startingPrice || "تواصل للسعر", textEn: service.startingPrice || "Contact for price" }]]
            ].map(([heading, items]) => (
              <div key={String(heading)} className="rounded-ui border border-line bg-white p-6 shadow-soft">
                <h3 className="text-xl font-black">{String(heading)}</h3>
                <div className="mt-4 grid gap-2 text-muted">
                  {(items as { textAr: string; textEn: string }[]).map(item => <p key={localized(locale, item.textAr, item.textEn)}>{localized(locale, item.textAr, item.textEn)}</p>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="inquiry" className="bg-white py-20">
          <div className="mx-auto w-[min(980px,calc(100%-32px))]">
            <SectionHeader kicker={t.startProject} title={locale === "ar" ? `طلب خدمة ${title}` : `${title} inquiry`} text={locale === "ar" ? "هذه الأسئلة مرتبطة بالخدمة المختارة وتظهر داخل لوحة الإدارة بعد الإرسال." : "These questions are tied to the selected service and appear in the admin dashboard after submission."} />
            {sentReference ? (
              <div className="mb-5 rounded-ui border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <strong>{locale === "ar" ? "تم استلام طلبك." : "Your inquiry has been received."}</strong>
                <p className="mt-1 text-sm">
                  {locale === "ar" ? "رقم الطلب" : "Reference"}: <span className="font-black">{sentReference}</span>
                  {" · "}
                  {emailStatus === "sent"
                    ? locale === "ar"
                      ? "تم إرسال رسالة شكر إلى بريدك."
                      : "A thank-you email was sent to your inbox."
                    : locale === "ar"
                      ? "سيتم إرسال رسالة الشكر بعد تفعيل بريد SMTP."
                      : "The thank-you email will send after SMTP is configured."}
                </p>
              </div>
            ) : null}
            <form action={submitInquiry} className="grid gap-4 rounded-ui border border-line bg-[#FAFBFF] p-5 shadow-soft md:grid-cols-2">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="serviceSlug" value={service.slug} />
              {fields.map(field => <Field key={field.key} field={field} locale={locale} />)}
              <label className="flex items-start gap-3 md:col-span-2">
                <input required type="checkbox" className="mt-1" />
                <span className="text-sm text-muted">{locale === "ar" ? "أوافق على استخدام بياناتي للتواصل معي بخصوص هذا الطلب." : "I agree to be contacted about this inquiry."}</span>
              </label>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button className="min-h-11 rounded-ui bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft" type="submit">{t.submit}</button>
                <ButtonLink href={whatsappUrl(title, locale)} variant="whatsapp">{t.whatsapp}</ButtonLink>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
