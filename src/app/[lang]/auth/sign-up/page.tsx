import { SignUpForm } from "@/components/forms/sign-up-form";
import { Locale, getDictionary } from "../../dictionaries";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm lang={lang} dict={dict.auth} />
      </div>
    </div>
  );
}
