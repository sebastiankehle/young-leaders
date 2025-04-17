import { getDictionary } from "@/app/[lang]/dictionaries";
import { Locale } from "@/app/[lang]/dictionaries";

export default async function PastApplicationsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <h1 className="text-xl font-bold">
        {dict.navigation.pastApplications || "Past Applications"}
      </h1>
      <p className="text-muted-foreground">
        {dict.pageDescriptions.pastApplications}
      </p>
    </>
  );
}
