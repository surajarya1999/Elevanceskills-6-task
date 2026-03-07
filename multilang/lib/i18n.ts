import { getRequestConfig } from "next-intl/server";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/types";

export default getRequestConfig(async ({ locale }) => {
  const validLocale = LOCALES.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE;
  return {
    locale: validLocale,
    messages: (await import(`@/messages/${validLocale}/index.json`)).default,
  };
});
