"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUser,
  IconMoon,
  IconSun,
  IconLanguage,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Locale } from "@/app/[lang]/dictionaries";

interface NavUserProps {
  user: {
    name: string;
    email: string;
  };
  dict?: {
    account: string;
    logout: string;
    profile?: string;
    theme?: string;
    language?: string;
    darkMode?: string;
    lightMode?: string;
  };
  lang?: Locale;
}

export function NavUser({ user, dict, lang }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState(lang || "en");

  // Default labels if no dictionary is provided
  const labels = {
    account: dict?.account || "Account",
    logout: dict?.logout || "Log out",
    profile: dict?.profile || "Profile",
    theme: dict?.theme || "Theme",
    language: dict?.language || "Language",
    darkMode: dict?.darkMode || "Dark Mode",
    lightMode: dict?.lightMode || "Light Mode",
  };

  // Generate initials from user name or email
  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Change language
  const changeLanguage = (newLang: Locale) => {
    setCurrentLanguage(newLang);
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|de)\//, "/");
    router.push(`/${newLang}${pathWithoutLang}`);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(lang ? `/${lang}/auth/login` : "/auth/login");
  };

  // Navigate to profile
  const navigateToProfile = () => {
    router.push(lang ? `/${lang}/profile` : "/profile");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarFallback className="rounded-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-sm text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-sm text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Profile link */}
            <DropdownMenuItem onClick={navigateToProfile}>
              <IconUser className="mr-2 size-4" />
              {labels.profile}
            </DropdownMenuItem>

            {/* Theme toggle - now as a regular button */}
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "dark" ? (
                <IconSun className="mr-2 size-4" />
              ) : (
                <IconMoon className="mr-2 size-4" />
              )}
              {theme === "light" ? labels.darkMode : labels.lightMode}
            </DropdownMenuItem>

            {/* Language selector - simpler text-based version */}
            <DropdownMenuItem onClick={(e) => e.preventDefault()}>
              <IconLanguage className="mr-2 size-4" />
              <span className="flex gap-2">
                <span
                  onClick={() => changeLanguage("en")}
                  className={`cursor-pointer ${currentLanguage === "en" ? "font-medium" : "text-muted-foreground text-sm"}`}
                >
                  English
                </span>
                <span className="text-muted-foreground text-sm">|</span>
                <span
                  onClick={() => changeLanguage("de")}
                  className={`cursor-pointer ${currentLanguage === "de" ? "font-medium" : "text-muted-foreground text-sm"}`}
                >
                  Deutsch
                </span>
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout className="mr-2 size-4" />
              {labels.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
