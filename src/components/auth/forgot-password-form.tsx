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
import { useState } from "react";
import { Locale } from "@/app/[lang]/dictionaries";

interface ForgotPasswordFormProps
  extends React.ComponentPropsWithoutRef<"div"> {
  lang?: Locale;
  dict?: {
    reset_password?: string;
    forgot_password_title?: string;
    email?: string;
    check_email?: string;
    email_sent?: string;
    already_account?: string;
    login?: string;
    [key: string]: string | undefined;
  };
}

export function ForgotPasswordForm({
  lang,
  dict = {},
  className,
  ...props
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${lang ? `/${lang}` : ""}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {dict.check_email || "Check Your Email"}
            </CardTitle>
            <CardDescription>
              {dict.email_sent || "Password reset instructions sent"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {dict.email_sent ||
                "If you registered using your email and password, you will receive a password reset email."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {dict.reset_password || "Reset Your Password"}
            </CardTitle>
            <CardDescription>
              {dict.forgot_password_title ||
                "Type in your email and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
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
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? "Sending..."
                    : dict.reset_password || "Send reset email"}
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
      )}
    </div>
  );
}
