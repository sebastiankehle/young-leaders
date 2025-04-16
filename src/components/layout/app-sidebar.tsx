"use client";

import * as React from "react";
import {
  IconCalendarEvent,
  IconDashboard,
  IconInnerShadowTop,
  IconSettings,
  IconUser,
  IconCalendar,
  IconList,
  IconUsers,
  IconPaint,
  IconLock,
  IconBuildingCommunity,
  IconChartBar,
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
      children: [
        {
          title: "Overview",
          url: "/dashboard/overview",
          icon: IconList,
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
          icon: IconChartBar,
        },
      ],
    },
    {
      title: "Events",
      url: "/events",
      icon: IconCalendarEvent,
      children: [
        {
          title: "Upcoming",
          url: "/events/upcoming",
          icon: IconCalendar,
        },
        {
          title: "Past Events",
          url: "/events/past",
          icon: IconCalendar,
        },
        {
          title: "Workshops",
          url: "/events/workshops",
          icon: IconUsers,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
      children: [
        {
          title: "Profile",
          url: "/settings/profile",
          icon: IconUser,
        },
        {
          title: "Appearance",
          url: "/settings/appearance",
          icon: IconPaint,
        },
        {
          title: "Security",
          url: "/settings/security",
          icon: IconLock,
        },
        {
          title: "Organization",
          url: "/settings/organization",
          icon: IconBuildingCommunity,
        },
      ],
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  dict?: {
    navigation: {
      dashboard: string;
      events: string;
      settings: string;
      theme: string;
      language: string;
    };
    user?: {
      account: string;
      logout: string;
    };
  };
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
          children: [
            {
              title: "Overview",
              url: `/${lang}/dashboard/overview`,
              icon: IconList,
            },
            {
              title: "Analytics",
              url: `/${lang}/dashboard/analytics`,
              icon: IconChartBar,
            },
          ],
        },
        {
          title: dict.navigation.events,
          url: `/${lang}/events`,
          icon: IconCalendarEvent,
          children: [
            {
              title: "Upcoming",
              url: `/${lang}/events/upcoming`,
              icon: IconCalendar,
            },
            {
              title: "Past Events",
              url: `/${lang}/events/past`,
              icon: IconCalendar,
            },
            {
              title: "Workshops",
              url: `/${lang}/events/workshops`,
              icon: IconUsers,
            },
          ],
        },
      ]
    : data.navMain;

  const navSecondary = dict
    ? [
        {
          title: dict.navigation.settings,
          url: `/${lang}/settings`,
          icon: IconSettings,
          children: [
            {
              title: "Profile",
              url: `/${lang}/settings/profile`,
              icon: IconUser,
            },
            {
              title: "Appearance",
              url: `/${lang}/settings/appearance`,
              icon: IconPaint,
            },
            {
              title: "Security",
              url: `/${lang}/settings/security`,
              icon: IconLock,
            },
            {
              title: "Organization",
              url: `/${lang}/settings/organization`,
              icon: IconBuildingCommunity,
            },
          ],
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
              <a href={lang ? `/${lang}/dashboard` : "/dashboard"}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">young leaders</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} label="Main Navigation" />
        <NavSecondary
          items={navSecondary}
          className="mt-auto"
          themeLabel={dict?.navigation.theme}
          languageLabel={dict?.navigation.language || "Language"}
          currentLang={lang}
          label="Settings & Preferences"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} dict={dict?.user} lang={lang} />
      </SidebarFooter>
    </Sidebar>
  );
}
