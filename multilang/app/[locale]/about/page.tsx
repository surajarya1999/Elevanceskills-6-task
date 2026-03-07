import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">{t("title")}</h1>
        <p className="text-blue-100 text-lg max-w-xl mx-auto">{t("subtitle")}</p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("missionTitle")}</h2>
          <p className="text-gray-600 leading-relaxed">{t("missionText")}</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("teamTitle")}</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { emoji: "👨‍💻", name: "Arya Singh",     country: "🇮🇳" },
            { emoji: "🎨", name: "Sofia Martín",   country: "🇪🇸" },
            { emoji: "⚙️", name: "Lucas Ferreira", country: "🇧🇷" },
          ].map(m => (
            <div key={m.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-5xl mb-3">{m.emoji}</div>
              <p className="font-bold text-gray-900">{m.name}</p>
              <p className="text-2xl mt-2">{m.country}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
