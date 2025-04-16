import { redirect } from "next/navigation";
import { Locale } from "./dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  // Redirect to the dashboard page with the same language
  redirect(`/${lang}/dashboard`);
}
