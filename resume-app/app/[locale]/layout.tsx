export const dynamic = "force-dynamic";

import { NextIntlClientProvider, useMessages } from "next-intl";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
