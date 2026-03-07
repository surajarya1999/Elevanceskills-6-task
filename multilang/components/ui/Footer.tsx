import { useTranslations } from "next-intl";
import type { Locale } from "@/types";
import { LOCALE_INFO, LOCALES } from "@/types";

export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white font-bold text-lg">🌍 MyApp</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {LOCALES.map(l => (
            <span key={l} className={`text-lg ${l === locale ? "opacity-100" : "opacity-40"}`}>
              {LOCALE_INFO[l].flag}
            </span>
          ))}
        </div>
        <p className="text-sm">© 2024 MyApp. All rights reserved.</p>
      </div>
    </footer>
  );
}
