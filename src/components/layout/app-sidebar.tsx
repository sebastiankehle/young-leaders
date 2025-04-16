"use client";

import * as React from "react";
import {
  IconCalendarEvent,
  IconDashboard,
  IconInnerShadowTop,
  IconSettings,
} from "@tabler/icons-react";
import { Locale } from "@/app/[lang]/dictionaries";

import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Default data that will be overridden by dictionary when available
const data = {
  user: {
    name: "Sebastian Kehle",
    email: "sebastian@youngleaders.io",
    avatar: "/avatars/sebastian.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Events",
      url: "/events",
      icon: IconCalendarEvent,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  dict?: any;
  lang?: Locale;
}

export function AppSidebar({ dict, lang = "en", ...props }: AppSidebarProps) {
  // Create localized navigation items when dictionary is available
  const navMain = dict
    ? [
        {
          title: dict.navigation.dashboard,
          url: `/${lang}/dashboard`,
          icon: IconDashboard,
        },
        {
          title: dict.navigation.events,
          url: `/${lang}/events`,
          icon: IconCalendarEvent,
        },
      ]
    : data.navMain;

  const navSecondary = dict
    ? [
        {
          title: dict.navigation.settings,
          url: `/${lang}/settings`,
          icon: IconSettings,
        },
      ]
    : data.navSecondary;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href={lang ? `/${lang}` : "/"}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">young leaders</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary
          items={navSecondary}
          className="mt-auto"
          themeLabel={dict?.navigation.theme}
          languageLabel={dict?.navigation.language || "Language"}
          currentLang={lang}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} dict={dict?.user} lang={lang} />
      </SidebarFooter>
    </Sidebar>
  );
}
