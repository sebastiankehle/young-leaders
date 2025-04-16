import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { Locale } from "./app/[lang]/dictionaries";

// Define the locales we support
export const locales: Locale[] = ["en", "de"];
export const defaultLocale: Locale = "en";

// Get the preferred locale, based on the client preferences and our supported locales
function getLocale(request: NextRequest): Locale {
  // Negotiator expects a request object with headers
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get("accept-language") || "";
  headers.set("accept-language", acceptLanguage);

  // Use negotiator and intl-localematcher to get the best locale
  let languages: string[] = [];
  try {
    const negotiatorHeaders = { "accept-language": acceptLanguage };
    languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  } catch (e) {
    // Fallback if negotiator fails
    languages = [defaultLocale];
  }

  return match(languages, locales, defaultLocale) as Locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|.*\\..*).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
