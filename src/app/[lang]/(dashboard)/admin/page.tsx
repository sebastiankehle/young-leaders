import { redirect } from "next/navigation";
import { Locale } from "@/app/[lang]/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/server";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  // Server-side authentication check
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // Require admin role to access this page
  await requireRole("admin");

  if (error || !data?.user) {
    redirect(`/${lang}/auth/login`);
  }

  // Redirect to dashboard page
  redirect(`/${lang}/dashboard`);
}
