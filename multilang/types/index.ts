export const LOCALES = ["en", "es", "hi", "pt", "zh", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const OTP_PROTECTED_LOCALES: Locale[] = ["fr"];

export interface LocaleInfo {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  en: { code: "en", label: "English",    nativeLabel: "English",   flag: "🇺🇸" },
  es: { code: "es", label: "Spanish",    nativeLabel: "Español",   flag: "🇪🇸" },
  hi: { code: "hi", label: "Hindi",      nativeLabel: "हिंदी",      flag: "🇮🇳" },
  pt: { code: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇧🇷" },
  zh: { code: "zh", label: "Chinese",    nativeLabel: "中文",        flag: "🇨🇳" },
  fr: { code: "fr", label: "French",     nativeLabel: "Français",  flag: "🇫🇷" },
};
