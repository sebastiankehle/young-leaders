import "../globals.css";
import { Locale } from "./dictionaries";
import { locales } from "@/middleware";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;

  return (
    <div lang={lang} data-lang={lang}>
      {children}
    </div>
  );
}
