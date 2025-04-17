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

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  lang?: Locale;
  dict?: {
    login?: string;
    login_title?: string;
    email?: string;
    password?: string;
    forgot_password?: string;
    no_account?: string;
    sign_up?: string;
    [key: string]: string | undefined;
  };
}

export function LoginForm({
  lang,
  dict = {},
  className,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Redirect with language parameter if available
      router.push(lang ? `/${lang}/dashboard` : "/dashboard");
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
          <CardTitle className="text-xl">{dict.login || "Login"}</CardTitle>
          <CardDescription>
            {dict.login_title ||
              "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
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
                  <Link
                    href={
                      lang
                        ? `/${lang}/auth/forgot-password`
                        : "/auth/forgot-password"
                    }
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {dict.forgot_password || "Forgot your password?"}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : dict.login || "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {dict.no_account || "Don't have an account?"}{" "}
              <Link
                href={lang ? `/${lang}/auth/sign-up` : "/auth/sign-up"}
                className="underline underline-offset-4"
              >
                {dict.sign_up || "Sign up"}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
