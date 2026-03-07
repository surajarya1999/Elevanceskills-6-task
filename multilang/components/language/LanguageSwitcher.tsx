"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import OtpModal from "@/components/otp/OtpModal";
import { LOCALE_INFO, LOCALES, OTP_PROTECTED_LOCALES, type Locale } from "@/types";

interface Props { currentLocale: Locale; }

export default function LanguageSwitcher({ currentLocale }: Props) {
  const t = useTranslations("language");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [pendingLocale, setPending] = useState<Locale | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (locale: Locale) => {
    setIsOpen(false);
    if (locale === currentLocale) return;

    if (OTP_PROTECTED_LOCALES.includes(locale)) {
      setPending(locale);
      setOtpOpen(true);
      return;
    }

    // Direct switch — window.location guaranteed kaam karta hai
    const parts = pathname.split("/");
    parts[1] = locale;
    window.location.href = parts.join("/");
  };

  const current = LOCALE_INFO[currentLocale];

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsOpen(v => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 shadow-sm"
        >
          <span className="text-lg">{current.flag}</span>
          <span className="hidden sm:inline">{current.nativeLabel}</span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
            <p className="px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide border-b border-gray-100">{t("select")}</p>
            {LOCALES.map(locale => {
              const info = LOCALE_INFO[locale];
              const isActive = locale === currentLocale;
              const needsOtp = OTP_PROTECTED_LOCALES.includes(locale);
              return (
                <button key={locale} onClick={() => handleSelect(locale)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className="text-xl">{info.flag}</span>
                  <span className="flex-1 text-left font-medium">{info.nativeLabel}</span>
                  {needsOtp && <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">🔐</span>}
                  {isActive && <span className="text-blue-600">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {pendingLocale && (
        <OtpModal
          isOpen={otpOpen}
          targetLocale={pendingLocale}
          currentPath={pathname}
          onClose={() => { setOtpOpen(false); setPending(null); }}
        />
      )}
    </>
  );
}
