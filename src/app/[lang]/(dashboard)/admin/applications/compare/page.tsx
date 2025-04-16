import { Locale, getDictionary } from "@/app/[lang]/dictionaries";
import { requireRole } from "@/lib/auth/server";

export default async function CompareApplicationsPage({
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
      <h1 className="text-2xl font-bold">
        {dict.navigation.compareApplications}
      </h1>
      <p className="text-muted-foreground mt-4">
        {dict.pageDescriptions.compareApplications}
      </p>
    </>
  );
}
