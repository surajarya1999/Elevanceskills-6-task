import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HomePage({ params }: { params: { locale: string } }) {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
          ⭐ {t("premium")} — {t("price")}
        </span>
        <h1 className="text-5xl font-extrabold text-gray-900 mt-6 mb-4">{t("title")}</h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">{t("subtitle")}</p>
        <Link href={`/${params.locale}/resume`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          📄 {t("cta")} →
        </Link>

        <div className="mt-16 grid sm:grid-cols-3 gap-6 text-left">
          {[
            { icon: "📝", title: "Fill Details", desc: "Enter your education, experience, and skills" },
            { icon: "🔐", title: "Verify & Pay", desc: "OTP verification + secure ₹50 payment" },
            { icon: "📄", title: "Get Resume", desc: "Download a professional PDF resume instantly" },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
