import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { Locale } from "./app/[lang]/dictionaries";
import { updateSession } from "./lib/supabase/middleware";

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
  } catch (error) {
    console.error(error);
    // Fallback if negotiator fails
    languages = [defaultLocale];
  }

  return match(languages, locales, defaultLocale) as Locale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // First, check for authentication on protected routes
  // Normalize path by removing potential locale prefix for protection checking
  const pathWithoutLocale = locales.some((locale) =>
    pathname.startsWith(`/${locale}/`),
  )
    ? pathname.replace(/^\/[a-z]{2}\//, "/")
    : pathname;

  const pathSegments = pathname.split("/").filter(Boolean);
  const pathSegmentsNoLocale = pathWithoutLocale.split("/").filter(Boolean);

  // Check for dashboard in either the original path or the path without locale
  const isDashboardRoute =
    pathname.includes("/dashboard") ||
    pathWithoutLocale.includes("/dashboard") ||
    pathSegments.includes("dashboard") ||
    pathSegmentsNoLocale.includes("dashboard") ||
    pathSegments.includes("(dashboard)") ||
    pathSegmentsNoLocale.includes("(dashboard)");

  // If it's a dashboard route, run the auth check
  if (
    isDashboardRoute &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.includes(".")
  ) {
    const authResponse = await updateSession(request);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }
  }

  // Then handle locale redirects
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
  ],
};
