import { notFound } from "next/navigation";
import { dir, isLocale, type Locale } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div lang={locale} dir={dir(locale as Locale)}>
      {children}
    </div>
  );
}
