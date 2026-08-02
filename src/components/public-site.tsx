import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, BrainCircuit, ChevronRight, LayoutDashboard, Palette, Phone, ShieldCheck, Sparkles, Video } from "lucide-react";
import { dictionary, type Locale } from "@/lib/i18n";
import { HeroMedia, HeroShowcase } from "@/components/hero-media";
import { whatsappUrl } from "@/lib/whatsapp";
import { ButtonLink, SectionHeader } from "@/components/ui";

type ServiceCard = {
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  featured: boolean;
  category: { nameAr: string; nameEn: string };
};

function serviceTitle(service: ServiceCard, locale: Locale) {
  return locale === "ar" ? service.titleAr : service.titleEn;
}

function serviceText(service: ServiceCard, locale: Locale) {
  return locale === "ar" ? service.excerptAr : service.excerptEn;
}

export function Header({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const other = locale === "ar" ? "en" : "ar";
  const phoneNumber = "+962 777 066 779";
  const links = [
    [t.home, `/${locale}`],
    [t.about, `/${locale}#about`],
    [t.services, `/${locale}/services`],
    [t.portfolio, `/${locale}#portfolio`],
    [t.packages, `/${locale}#packages`],
    [t.contact, `/${locale}#contact`]
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-20 w-[min(1180px,calc(100%-32px))] items-center justify-between gap-5">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <Image src="/km-logo.png" alt="KM Agency logo" width={46} height={46} className="h-11 w-11 rounded-ui object-cover shadow-soft" priority />
          <span className="text-lg font-black text-ink">KM Agency</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-muted lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-brand-600">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a className="hidden rounded-ui border border-line bg-white px-3 py-2 text-sm font-bold text-ink xl:inline-flex" href="tel:+962777066779">
            {phoneNumber}
          </a>
          <ButtonLink href={whatsappUrl("KM Agency", locale)} variant="whatsapp">{t.whatsapp}</ButtonLink>
          <Link className="rounded-ui border border-line bg-white px-3 py-2 text-sm font-bold text-ink" href={`/${other}`}>
            {other === "ar" ? "العربية" : "English"}
          </Link>
          <Link className="hidden rounded-ui bg-ink px-3 py-2 text-sm font-bold text-white md:inline-flex" href="/admin/login">
            {t.admin}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function HomePage({ locale, services }: { locale: Locale; services: ServiceCard[] }) {
  const t = dictionary[locale];
  const featured = services.filter(service => service.featured).slice(0, 6);
  const icons = [LayoutDashboard, Palette, BarChart3, Video, BrainCircuit, ShieldCheck];

  return (
    <>
      <Header locale={locale} />
      <main>
        <section className="relative overflow-hidden bg-[#0E1836] text-white">
          <HeroMedia />
          <div className="relative mx-auto grid min-h-[760px] w-[min(1180px,calc(100%-32px))] items-center gap-10 py-16 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">{t.heroKicker}</span>
              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">{t.heroTitle}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">{t.heroText}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={`/${locale}/services`} variant="primary">{t.explore}</ButtonLink>
                <ButtonLink href={whatsappUrl("KM Agency", locale)} variant="whatsapp">{t.whatsapp}</ButtonLink>
                <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-ui border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15" href="tel:+962777066779">
                  <Phone size={18} />
                  +962 777 066 779
                </a>
              </div>
            </div>
            <div className="grid gap-4">
              <HeroShowcase />
              <div className="rounded-ui border border-white/12 bg-white p-5 text-ink shadow-soft">
              <div className="grid gap-3">
                {featured.slice(0, 4).map((service, index) => (
                  <Link key={service.slug} href={`/${locale}/services/${service.slug}`} className="group rounded-ui border border-line bg-slate-50 p-4 transition hover:border-brand-500 hover:bg-white">
                    <span className="text-xs font-black uppercase tracking-normal text-coral">0{index + 1}</span>
                    <h3 className="mt-1 text-xl font-black">{serviceTitle(service, locale)}</h3>
                    <p className="mt-1 text-sm text-muted">{serviceText(service, locale)}</p>
                  </Link>
                ))}
              </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <SectionHeader kicker={t.about} title={locale === "ar" ? "من نحن" : "About Us"} text={locale === "ar" ? "KM Agency وكالة رقمية متخصصة في بناء الهوية، المواقع، الحملات، المحتوى، الفيديو، وتحسين الظهور الرقمي للشركات التي تريد نموا حقيقيا." : "KM Agency is a digital agency focused on branding, websites, campaigns, content, video, and search visibility for businesses that want real growth."} />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                [Sparkles, locale === "ar" ? "هوية قوية" : "Strong Identity"],
                [ShieldCheck, locale === "ar" ? "ثقة ووضوح" : "Trust and Clarity"],
                [BarChart3, locale === "ar" ? "تحويل وقياس" : "Conversion and Tracking"]
              ].map(([Icon, label]) => (
                <div key={String(label)} className="rounded-ui border border-line bg-white p-6 shadow-soft">
                  <Icon className="text-brand-600" />
                  <h3 className="mt-4 text-xl font-black">{String(label)}</h3>
                  <p className="mt-2 text-muted">{locale === "ar" ? "تصميم هادئ ومهني مع رسائل واضحة تساعد العميل على اتخاذ القرار." : "A calm professional design with clear messaging that helps customers decide."}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <SectionHeader kicker={t.featuredServices} title={locale === "ar" ? "خدماتنا" : "Our Services"} text={t.servicesText} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((service, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <Link key={service.slug} href={`/${locale}/services/${service.slug}`} className="group rounded-ui border border-line bg-[#FAFBFF] p-6 transition hover:-translate-y-1 hover:border-brand-500 hover:bg-white hover:shadow-soft">
                    <Icon className="text-brand-600" />
                    <p className="mt-4 text-sm font-bold text-coral">{locale === "ar" ? service.category.nameAr : service.category.nameEn}</p>
                    <h3 className="mt-2 text-2xl font-black text-ink">{serviceTitle(service, locale)}</h3>
                    <p className="mt-3 text-muted">{serviceText(service, locale)}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-600">
                      {t.startProject}
                      <ChevronRight size={16} className={locale === "ar" ? "rotate-180" : ""} />
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8">
              <ButtonLink href={`/${locale}/services`} variant="dark">{locale === "ar" ? "عرض المزيد من الخدمات" : "See More Services"}</ButtonLink>
            </div>
          </div>
        </section>

        <section id="portfolio" className="py-20">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[.95fr_1.05fr]">
            <div className="min-h-[420px] rounded-ui bg-[url('/media/portfolio-team.jpg')] bg-cover bg-center shadow-soft" />
            <div className="flex flex-col justify-center">
              <SectionHeader kicker={t.portfolio} title={locale === "ar" ? "تجارب رقمية مصممة لتوليد طلبات أفضل" : "Digital experiences designed to generate better inquiries"} />
            </div>
          </div>
        </section>

        <section id="packages" className="bg-white py-20 text-ink">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <SectionHeader kicker={t.packages} title={locale === "ar" ? "باقات مرنة حسب حجم المشروع" : "Flexible packages by project size"} text={locale === "ar" ? "ابدأ صغيرا أو ابن منصة كاملة. كل شيء قابل للإدارة من لوحة التحكم." : "Start small or build a complete platform. Everything is manageable from the dashboard."} />
            <div className="grid gap-4 md:grid-cols-3">
              {["Starter", "Growth", "Enterprise"].map((name, index) => (
                <div key={name} className="rounded-ui border border-line bg-[#FAFBFF] p-6 shadow-soft">
                  <h3 className="text-2xl font-black">{name}</h3>
                  <p className="mt-3 text-muted">{index === 1 ? "Starting from 750 JOD" : "Contact for price"}</p>
                  <ButtonLink href={whatsappUrl(name, locale)} variant={index === 1 ? "whatsapp" : "outline"} className="mt-6">{t.whatsapp}</ButtonLink>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))] rounded-ui bg-white p-8 shadow-soft md:p-12">
            <SectionHeader kicker={t.contact} title={locale === "ar" ? "ابدأ من الخدمة المناسبة أو تواصل مباشرة عبر واتساب" : "Start with the right service or contact us directly on WhatsApp"} />
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <a className="rounded-ui border border-line bg-[#FAFBFF] p-5 transition hover:border-brand-500" href="tel:+962777066779">
                <p className="text-sm font-bold text-muted">{locale === "ar" ? "رقم الهاتف" : "Phone"}</p>
                <strong className="mt-2 block text-xl text-ink">+962 777 066 779</strong>
              </a>
              <a className="rounded-ui border border-line bg-[#FAFBFF] p-5 transition hover:border-brand-500" href="mailto:sales@kmagency.online">
                <p className="text-sm font-bold text-muted">{locale === "ar" ? "البريد الإلكتروني" : "Sales email"}</p>
                <strong className="mt-2 block text-xl text-ink">sales@kmagency.online</strong>
              </a>
              <a className="rounded-ui border border-line bg-[#FAFBFF] p-5 transition hover:border-brand-500" href={whatsappUrl("KM Agency", locale)} target="_blank" rel="noreferrer">
                <p className="text-sm font-bold text-muted">WhatsApp</p>
                <strong className="mt-2 block text-xl text-ink">+962 777 066 779</strong>
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/services`} variant="primary">{t.startProject}</ButtonLink>
              <ButtonLink href={whatsappUrl("KM Agency", locale)} variant="whatsapp">{t.whatsapp}</ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-line bg-white py-6">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-2 text-sm font-bold text-muted md:flex-row md:items-center md:justify-between">
          <span>KM Agency</span>
          <span>All rights reserved 2026</span>
        </div>
      </footer>
    </>
  );
}

export function ServicesPage({ locale, services }: { locale: Locale; services: ServiceCard[] }) {
  const t = dictionary[locale];
  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto w-[min(1180px,calc(100%-32px))] py-16">
        <SectionHeader kicker={t.services} title={locale === "ar" ? "اختر الخدمة التي تحتاجها" : "Choose the service you need"} text={t.servicesText} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <Link key={service.slug} href={`/${locale}/services/${service.slug}`} className="rounded-ui border border-line bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand-500">
              <p className="text-sm font-bold text-coral">{locale === "ar" ? service.category.nameAr : service.category.nameEn}</p>
              <h2 className="mt-2 text-2xl font-black">{serviceTitle(service, locale)}</h2>
              <p className="mt-3 text-muted">{serviceText(service, locale)}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-600">
                {t.startProject}
                <ArrowRight size={16} className={locale === "ar" ? "rotate-180" : ""} />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
