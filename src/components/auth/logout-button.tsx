"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Locale } from "@/app/[lang]/dictionaries";

interface LogoutButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  lang?: Locale;
  label?: string;
  children?: React.ReactNode;
}

export function LogoutButton({
  lang,
  label = "Logout",
  children,
  ...props
}: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(lang ? `/${lang}/auth/login` : "/auth/login");
  };

  return (
    <Button onClick={logout} {...props}>
      {children || label}
    </Button>
  );
}
