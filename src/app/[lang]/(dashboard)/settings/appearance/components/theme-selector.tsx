"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only update after component has mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { value: "light", label: "Light", icon: IconSun },
    { value: "dark", label: "Dark", icon: IconMoon },
    { value: "system", label: "System", icon: IconDeviceDesktop },
  ];

  return (
    <div className="mt-4">
      <h2 className="mb-3 text-lg font-medium">Select Theme</h2>
      <div className="flex flex-wrap gap-2">
        {themes.map((t) => {
          const Icon = t.icon;
          return (
            <Button
              key={t.value}
              variant={theme === t.value ? "default" : "outline"}
              onClick={() => setTheme(t.value)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
