import { redirect } from "next/navigation";
import { Locale } from "@/app/[lang]/dictionaries";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  // Server-side authentication check
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect(`/${lang}/auth/login`);
  }

  // Redirect to personal info page as the default subpage
  redirect(`/${lang}/profile/personal`);
}
