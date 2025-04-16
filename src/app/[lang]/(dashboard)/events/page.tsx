import { Locale, getDictionary } from "../../dictionaries";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {dict.navigation.events}
      </h1>

      <p className="text-muted-foreground">
        Welcome to your events page. Here you can manage your events and view
        your activity.
      </p>
    </div>
  );
}
