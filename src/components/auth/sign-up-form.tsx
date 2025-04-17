"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Locale } from "@/app/[lang]/dictionaries";

interface SignUpFormProps extends React.ComponentPropsWithoutRef<"div"> {
  lang?: Locale;
  dict?: {
    sign_up?: string;
    sign_up_title?: string;
    email?: string;
    password?: string;
    repeat_password?: string;
    already_account?: string;
    login?: string;
    passwords_dont_match?: string;
    [key: string]: string | undefined;
  };
}

export function SignUpForm({
  lang,
  dict = {},
  className,
  ...props
}: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError(dict.passwords_dont_match || "Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${lang ? `/${lang}` : ""}/dashboard`,
        },
      });
      if (error) throw error;
      router.push(
        lang ? `/${lang}/auth/sign-up-success` : "/auth/sign-up-success",
      );
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{dict.sign_up || "Sign up"}</CardTitle>
          <CardDescription>
            {dict.sign_up_title || "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{dict.email || "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    {dict.password || "Password"}
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">
                    {dict.repeat_password || "Repeat Password"}
                  </Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Creating an account..."
                  : dict.sign_up || "Sign up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {dict.already_account || "Already have an account?"}{" "}
              <Link
                href={lang ? `/${lang}/auth/login` : "/auth/login"}
                className="underline underline-offset-4"
              >
                {dict.login || "Login"}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
