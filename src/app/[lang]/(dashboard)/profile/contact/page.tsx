import { getDictionary } from "@/app/[lang]/dictionaries";
import { Locale } from "@/app/[lang]/dictionaries";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { getCurrentUser } from "@/lib/auth/server";

export default async function ContactDetailsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // Get user role for conditional tab rendering
  const user = await getCurrentUser();
  const userRole = user?.role || "user";

  return (
    <div className="space-y-6">
      <ProfileTabs lang={lang} dict={dict} userRole={userRole} />

      <div>
        <p className="text-muted-foreground text-sm">
          {dict.pageDescriptions.contactDetails}
        </p>

        {/* Contact details form would go here */}
        <div className="bg-card mt-6 rounded-lg border p-6">
          <p>Contact details form content</p>
        </div>
      </div>
    </div>
  );
}
