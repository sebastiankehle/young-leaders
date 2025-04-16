import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import { ThemeSelector } from "./components/theme-selector";

export default async function AppearancePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <h1 className="text-2xl font-bold">{dict.navigation.appearance}</h1>
      <p className="text-muted-foreground mt-4 mb-6">
        {dict.pageDescriptions.appearance || dict.pageDescriptions.settings}
      </p>

      <ThemeSelector />
    </>
  );
}
