import { Locale, getDictionary } from "./dictionaries";
import Link from "next/link";
import { locales } from "@/middleware";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-6 text-4xl font-bold">Young Leaders</h1>

      <div className="mb-6">
        <p>Current language: {lang.toUpperCase()}</p>
        <div className="mt-2 flex gap-4">
          {locales.map((locale) => (
            <Link
              key={locale}
              href={`/${locale}`}
              className={`rounded border px-3 py-1 ${locale === lang ? "bg-blue-500 text-white" : "bg-white text-black"}`}
            >
              {locale.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid max-w-md grid-cols-2 gap-4">
        <Link
          href={`/${lang}/dashboard`}
          className="rounded border p-4 shadow hover:bg-gray-100"
        >
          {dict.navigation.dashboard}
        </Link>
        <Link
          href={`/${lang}/events`}
          className="rounded border p-4 shadow hover:bg-gray-100"
        >
          {dict.navigation.events}
        </Link>
        <Link
          href={`/${lang}/settings`}
          className="rounded border p-4 shadow hover:bg-gray-100"
        >
          {dict.navigation.settings}
        </Link>
      </div>
    </main>
  );
}
