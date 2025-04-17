import { getDictionary } from "@/app/[lang]/dictionaries";
import { Locale } from "@/app/[lang]/dictionaries";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <h1 className="text-xl font-bold">{dict.navigation.events}</h1>
      <p className="text-muted-foreground">{dict.pageDescriptions.events}</p>
    </>
  );
}
