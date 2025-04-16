import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { locales } from "../../middleware";
import { Locale } from "../../app/[lang]/dictionaries";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if the user is trying to access a protected route
  const pathname = request.nextUrl.pathname;

  // Get current locale from URL if it exists
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentLocale =
    pathSegments.length > 0 && locales.includes(pathSegments[0] as Locale)
      ? pathSegments[0]
      : "en";

  // Extract locale from path to check for dashboard routes regardless of language prefix
  const isDashboardInPath =
    pathname.includes("/dashboard") || pathname.includes("/(dashboard)");

  // Check if dashboard is in the segments (after any locale)
  const isDashboardInSegments = pathSegments.some(
    (segment) => segment === "dashboard" || segment === "(dashboard)",
  );

  const isDashboardRoute = isDashboardInPath || isDashboardInSegments;

  console.log(
    `Auth check: Path=${pathname}, isDashboardRoute=${isDashboardRoute}, user=${user ? "authenticated" : "not authenticated"}`,
  );

  if (
    !user &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/auth") &&
    isDashboardRoute
  ) {
    // no user, redirect to the login page
    const url = request.nextUrl.clone();
    // Redirect to localized login page
    url.pathname = `/${currentLocale}/auth/login`;
    console.log(
      `Redirecting unauthenticated user from ${pathname} to ${url.pathname}`,
    );
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
