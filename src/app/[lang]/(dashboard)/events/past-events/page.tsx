import { getDictionary } from "@/app/[lang]/dictionaries";
import { Locale } from "@/app/[lang]/dictionaries";

export default async function PastEventsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <h1 className="text-xl font-bold">
        {dict.navigation.pastEvents || "Past Events"}
      </h1>
      <p className="text-muted-foreground">
        {dict.pageDescriptions.pastEvents}
      </p>
    </>
  );
}
