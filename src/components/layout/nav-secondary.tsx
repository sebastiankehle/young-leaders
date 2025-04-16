"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";
import { IconMoon, IconSun, IconLanguage } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@/app/[lang]/dictionaries";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
  label?: string;
}

export function NavSecondary({
  items,
  className,
  themeLabel = "Theme",
  languageLabel = "Language",
  currentLang = "en",
  label = "Preferences",
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
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url} className="flex items-center gap-2">
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/* Theme Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleTheme} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <ThemeIcon className="size-4" />
                <span>{themeLabel}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Language Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleLanguage}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <IconLanguage className="size-4" />
                <span>{languageLabel}</span>
              </div>
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
