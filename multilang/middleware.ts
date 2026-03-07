import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "es", "hi", "pt", "zh", "fr"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).+)", "/"],
};
