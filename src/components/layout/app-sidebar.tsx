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
  IconPaint,
  IconClock,
  IconClipboardList,
  IconPhoneCall,
  IconMapPin,
  IconSchool,
  IconId,
  IconCreditCard,
  IconCar,
} from "@tabler/icons-react";
import { Locale } from "@/app/[lang]/dictionaries";
import { createClient } from "@/lib/supabase/client";

import { NavItem, NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

// Default data that will be overridden by dictionary when available
const data: {
  navMain: NavItem[];
  navUser: NavItem[];
} = {
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
      children: [
        {
          title: "Current Events",
          url: "/events/current",
          icon: IconClock,
        },
        {
          title: "Past Events",
          url: "/events/past",
          icon: IconCalendar,
        },
      ],
    },
    {
      title: "Applications",
      url: "/applications",
      icon: IconClipboardList,
      children: [
        {
          title: "Current Applications",
          url: "/applications/current",
          icon: IconList,
        },
        {
          title: "Past Applications",
          url: "/applications/past",
          icon: IconList,
        },
      ],
    },
  ],
  navUser: [
    {
      title: "Profile",
      url: "/profile",
      icon: IconUser,
      children: [
        {
          title: "Personal Information",
          url: "/profile/personal",
          icon: IconUser,
        },
        {
          title: "Contact Details",
          url: "/profile/contact",
          icon: IconPhoneCall,
        },
        {
          title: "Address",
          url: "/profile/address",
          icon: IconMapPin,
        },
        {
          title: "Education",
          url: "/profile/education",
          icon: IconSchool,
        },
        {
          title: "Preferences",
          url: "/profile/preferences",
          icon: IconSettings,
        },
        {
          title: "Teamer Information",
          url: "/profile/teamer",
          icon: IconId,
          requiredRole: "teamer",
          children: [
            {
              title: "Banking Details",
              url: "/profile/teamer/banking",
              icon: IconCreditCard,
              requiredRole: "teamer",
            },
            {
              title: "Driver Information",
              url: "/profile/teamer/driver",
              icon: IconCar,
              requiredRole: "teamer",
            },
          ],
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
      children: [
        {
          title: "Appearance",
          url: "/settings/appearance",
          icon: IconPaint,
        },
        {
          title: "Language",
          url: "/settings/language",
          icon: IconList,
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
      applications?: string;
      profile?: string;
      settings: string;
      theme: string;
      language: string;
      appearance?: string;
      // Profile section
      personalInfo?: string;
      contactDetails?: string;
      address?: string;
      education?: string;
      preferences?: string;
      teamerInfo?: string;
      bankingDetails?: string;
      driverInfo?: string;
      // Events section
      currentEvents?: string;
      pastEvents?: string;
      // Applications section
      currentApplications?: string;
      pastApplications?: string;
      // Group labels
      mainNavigation?: string;
      userSettings?: string;
    };
    user?: {
      account: string;
      logout: string;
    };
  };
  lang?: Locale;
}

export function AppSidebar({ dict, lang = "en", ...props }: AppSidebarProps) {
  const [userData, setUserData] = React.useState({
    name: "",
    email: "",
    avatar: "/avatars/default.jpg",
  });

  React.useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Get user profile data from Supabase
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setUserData({
          name: profile?.full_name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          avatar: profile?.avatar_url || "/avatars/default.jpg",
        });
      }
    };

    fetchUserData();
  }, []);

  // Create localized navigation items when dictionary is available
  const navMain: NavItem[] = dict
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
          children: [
            {
              title: dict.navigation.currentEvents || "Current Events",
              url: `/${lang}/events/current`,
              icon: IconClock,
            },
            {
              title: dict.navigation.pastEvents || "Past Events",
              url: `/${lang}/events/past`,
              icon: IconCalendar,
            },
          ],
        },
        {
          title: dict.navigation.applications || "Applications",
          url: `/${lang}/applications`,
          icon: IconClipboardList,
          children: [
            {
              title:
                dict.navigation.currentApplications || "Current Applications",
              url: `/${lang}/applications/current`,
              icon: IconList,
            },
            {
              title: dict.navigation.pastApplications || "Past Applications",
              url: `/${lang}/applications/past`,
              icon: IconList,
            },
          ],
        },
      ]
    : data.navMain;

  const navUser: NavItem[] = dict
    ? [
        {
          title: dict.navigation.profile || "Profile",
          url: `/${lang}/profile`,
          icon: IconUser,
          children: [
            {
              title: dict.navigation.personalInfo || "Personal Information",
              url: `/${lang}/profile/personal`,
              icon: IconUser,
            },
            {
              title: dict.navigation.contactDetails || "Contact Details",
              url: `/${lang}/profile/contact`,
              icon: IconPhoneCall,
            },
            {
              title: dict.navigation.address || "Address",
              url: `/${lang}/profile/address`,
              icon: IconMapPin,
            },
            {
              title: dict.navigation.education || "Education",
              url: `/${lang}/profile/education`,
              icon: IconSchool,
            },
            {
              title: dict.navigation.preferences || "Preferences",
              url: `/${lang}/profile/preferences`,
              icon: IconSettings,
            },
            {
              title: dict.navigation.teamerInfo || "Teamer Information",
              url: `/${lang}/profile/teamer`,
              icon: IconId,
              requiredRole: "teamer",
              children: [
                {
                  title: dict.navigation.bankingDetails || "Banking Details",
                  url: `/${lang}/profile/teamer/banking`,
                  icon: IconCreditCard,
                  requiredRole: "teamer",
                },
                {
                  title: dict.navigation.driverInfo || "Driver Information",
                  url: `/${lang}/profile/teamer/driver`,
                  icon: IconCar,
                  requiredRole: "teamer",
                },
              ],
            },
          ],
        },
        {
          title: dict.navigation.settings,
          url: `/${lang}/settings`,
          icon: IconSettings,
          children: [
            {
              title: dict.navigation.appearance || "Appearance",
              url: `/${lang}/settings/appearance`,
              icon: IconPaint,
            },
            {
              title: dict.navigation.language || "Language",
              url: `/${lang}/settings/language`,
              icon: IconList,
            },
          ],
        },
      ]
    : data.navUser;

  // Get translated group labels or use defaults
  const mainNavigationLabel =
    dict?.navigation.mainNavigation || "Main Navigation";
  const userSettingsLabel = dict?.navigation.userSettings || "User Settings";

  return (
    <Sidebar collapsible="icon" {...props}>
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
        <NavMain items={navMain} label={mainNavigationLabel} />
        <div className="mt-6">
          <NavMain items={navUser} label={userSettingsLabel} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} dict={dict?.user} lang={lang} />
      </SidebarFooter>
    </Sidebar>
  );
}
