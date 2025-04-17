import { getDictionary } from "@/app/[lang]/dictionaries";
import { Locale } from "@/app/[lang]/dictionaries";

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <h1 className="text-xl font-bold">{dict.navigation.applications}</h1>
      <p className="text-muted-foreground">
        {dict.pageDescriptions.applications}
      </p>
    </>
  );
}
