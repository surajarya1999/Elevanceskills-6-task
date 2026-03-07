import { useTranslations } from "next-intl";
import { LOCALE_INFO, LOCALES } from "@/types";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      {/* Hero */}
      <section className="bg-blue-600 text-white py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">{t("title")}</h1>
        <p className="text-blue-100 text-base sm:text-xl mb-8 max-w-xl mx-auto">{t("subtitle")}</p>
        <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
          {t("cta")}
        </button>
      </section>

      {/* Languages */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t("langsTitle")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LOCALES.map(locale => {
            const info = LOCALE_INFO[locale];
            return (
              <div key={locale} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                <span className="text-3xl flex-shrink-0">{info.flag}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{info.nativeLabel}</p>
                  <p className="text-xs text-gray-400 truncate">{info.label}</p>
                </div>
                {locale === "fr" && <span className="ml-auto text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full flex-shrink-0">🔐</span>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}