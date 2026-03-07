export const dynamic = 'force-dynamic';
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/types";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const { locale } = params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col">
        <Header locale={locale as Locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} />
      </div>
    </NextIntlClientProvider>
  );
}
