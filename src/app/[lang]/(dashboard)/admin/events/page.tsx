import { Locale, getDictionary } from "@/app/[lang]/dictionaries";
import { requireRole } from "@/lib/auth/server";

export default async function AdminEventsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // Require admin role to access this page
  await requireRole("admin");

  return (
    <>
      <h1 className="text-xl font-bold">{dict.navigation.adminEvents}</h1>
      <p className="text-muted-foreground">
        {dict.pageDescriptions.adminEvents}
      </p>
    </>
  );
}
