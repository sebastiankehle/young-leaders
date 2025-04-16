"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconMoon, IconSun } from "@tabler/icons-react";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          Choose your preferred theme for the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            className={`hover:bg-accent hover:text-accent-foreground flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4 ${
              theme === "light" ? "border-primary" : "border-muted"
            }`}
            onClick={() => setTheme("light")}
          >
            <IconSun className="mb-3 h-6 w-6" />
            <span className="font-medium">Light</span>
          </div>

          <div
            className={`hover:bg-accent hover:text-accent-foreground flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4 ${
              theme === "dark" ? "border-primary" : "border-muted"
            }`}
            onClick={() => setTheme("dark")}
          >
            <IconMoon className="mb-3 h-6 w-6" />
            <span className="font-medium">Dark</span>
          </div>

          <div
            className={`hover:bg-accent hover:text-accent-foreground flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4 ${
              theme === "system" ? "border-primary" : "border-muted"
            }`}
            onClick={() => setTheme("system")}
          >
            <div className="mb-3 flex h-6 w-6 items-center justify-center">
              <IconSun className="h-4 w-4 dark:hidden" />
              <IconMoon className="hidden h-4 w-4 dark:block" />
            </div>
            <span className="font-medium">System</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
