import { getDictionary } from "@/app/[lang]/dictionaries";
import { Locale } from "@/app/[lang]/dictionaries";

export default async function ContactDetailsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <h1 className="text-2xl font-bold">
        {dict.navigation.contactDetails || "Contact Details"}
      </h1>
      <p className="text-muted-foreground mt-4">
        {dict.pageDescriptions.contactDetails}
      </p>
    </>
  );
}
