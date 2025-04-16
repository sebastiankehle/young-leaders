import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import { LanguageSelector } from "./components/language-selector";

export default async function LanguagePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <h1 className="text-2xl font-bold">{dict.navigation.language}</h1>
      <p className="text-muted-foreground mt-4 mb-6">
        {dict.pageDescriptions.language || dict.pageDescriptions.settings}
      </p>

      <LanguageSelector currentLang={lang} />
    </>
  );
}
