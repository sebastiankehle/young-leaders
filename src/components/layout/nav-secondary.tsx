"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";
import { IconMoon, IconSun, IconLanguage } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/middleware";
import { Locale } from "@/app/[lang]/dictionaries";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavSecondaryProps {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
  className?: string;
  themeLabel?: string;
  languageLabel?: string;
  currentLang?: Locale;
}

export function NavSecondary({
  items,
  className,
  themeLabel = "Theme",
  languageLabel = "Language",
  currentLang = "en",
}: NavSecondaryProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  // Use state to track the theme icon to prevent hydration mismatch
  const [mounted, setMounted] = React.useState(false);

  // Only update after component has mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    // Switch between "en" and "de"
    const newLang = currentLang === "en" ? "de" : "en";

    // Get the current path without the language prefix
    const segments = pathname.split("/");
    segments[1] = newLang; // Replace the language segment
    router.push(segments.join("/"));
  };

  // Render a placeholder during SSR to avoid hydration mismatch
  const ThemeIcon = mounted && theme === "dark" ? IconMoon : IconSun;

  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/* Theme Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleTheme} className="cursor-pointer">
              <ThemeIcon className="size-4" />
              <span>{themeLabel}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Language Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleLanguage}
              className="cursor-pointer"
            >
              <IconLanguage className="size-4" />
              <span>{languageLabel}</span>
              <span className="ml-auto text-xs font-medium uppercase">
                {currentLang}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
