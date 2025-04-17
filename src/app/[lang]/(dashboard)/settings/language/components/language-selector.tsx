"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

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

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  return (
    <div className="mt-4">
      <h2 className="mb-3 text-lg font-medium">Select Language</h2>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLang === lang.code ? "default" : "outline"}
            onClick={() => setLanguage(lang.code as LocaleType)}
            className="flex items-center gap-2"
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
