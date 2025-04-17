import { Locale, getDictionary } from "../../dictionaries";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <h1 className="mb-4 text-xl font-bold">{dict.navigation.dashboard}</h1>
      <p className="text-muted-foreground text-sm">
        {dict.pageDescriptions.dashboard}
      </p>
    </>
  );
}
