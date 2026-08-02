import Link from "next/link";
import { notFound } from "next/navigation";
import { dictionary, isLocale } from "@/lib/i18n";

export default async function ThankYouPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { locale } = await params;
  const { ref } = await searchParams;
  if (!isLocale(locale)) notFound();
  const t = dictionary[locale];
  return (
    <main className="grid min-h-screen place-items-center bg-[#0E1836] p-6 text-white">
      <section className="max-w-xl rounded-ui bg-white p-8 text-center text-ink shadow-soft">
        <h1 className="text-4xl font-black">{t.thankYou}</h1>
        <p className="mt-4 text-lg text-muted">{t.inquirySuccess} <strong>{ref}</strong>.</p>
        <p className="mt-2 text-muted">{t.nextStep}</p>
        <Link className="mt-6 inline-flex rounded-ui bg-brand-600 px-5 py-3 text-sm font-bold text-white" href={`/${locale}`}>
          {t.home}
        </Link>
      </section>
    </main>
  );
}
