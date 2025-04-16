"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, usePathname } from "next/navigation";

// Using the type locally to avoid duplicate imports
type LocaleType = "en" | "de";

export function LanguageSelector({ currentLang }: { currentLang: LocaleType }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Only update after component has mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const setLanguage = (lang: LocaleType) => {
    // Get the current path without the language prefix
    const segments = pathname.split("/");
    segments[1] = lang; // Replace the language segment
    router.push(segments.join("/"));
  };

  if (!mounted) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language</CardTitle>
        <CardDescription>
          Choose your preferred language for the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            className={`hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center rounded-md border-2 p-4 ${
              currentLang === "en" ? "border-primary" : "border-muted"
            }`}
            onClick={() => setLanguage("en")}
          >
            <div className="mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border">
              <span className="text-lg font-bold">🇬🇧</span>
            </div>
            <div>
              <div className="font-medium">English</div>
              <div className="text-muted-foreground text-xs">English</div>
            </div>
          </div>

          <div
            className={`hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center rounded-md border-2 p-4 ${
              currentLang === "de" ? "border-primary" : "border-muted"
            }`}
            onClick={() => setLanguage("de")}
          >
            <div className="mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border">
              <span className="text-lg font-bold">🇩🇪</span>
            </div>
            <div>
              <div className="font-medium">Deutsch</div>
              <div className="text-muted-foreground text-xs">German</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
