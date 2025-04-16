"use client";

import React from "react";
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
  type Icon,
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
import { UserRole } from "@/lib/auth/roles";

// Define type for navigation item
type NavStructureItem = {
  key: string;
  url: string;
  icon: Icon;
  requiredRole?: UserRole;
  children?: NavStructureItem[];
};

// Define navigation structure once
const navigationStructure: {
  navMain: NavStructureItem[];
  navUser: NavStructureItem[];
} = {
  navMain: [
    {
      key: "dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      key: "events",
      url: "/events",
      icon: IconCalendarEvent,
      children: [
        {
          key: "currentEvents",
          url: "/events/current-events",
          icon: IconClock,
        },
        {
          key: "pastEvents",
          url: "/events/past-events",
          icon: IconCalendar,
        },
      ],
    },
    {
      key: "applications",
      url: "/applications",
      icon: IconClipboardList,
      children: [
        {
          key: "currentApplications",
          url: "/applications/current-applications",
          icon: IconList,
        },
        {
          key: "pastApplications",
          url: "/applications/past-applications",
          icon: IconList,
        },
      ],
    },
  ],
  navUser: [
    {
      key: "profile",
      url: "/profile",
      icon: IconUser,
      children: [
        {
          key: "personalInfo",
          url: "/profile/personal",
          icon: IconUser,
        },
        {
          key: "contactDetails",
          url: "/profile/contact",
          icon: IconPhoneCall,
        },
        {
          key: "address",
          url: "/profile/address",
          icon: IconMapPin,
        },
        {
          key: "education",
          url: "/profile/education",
          icon: IconSchool,
        },
        {
          key: "preferences",
          url: "/profile/preferences",
          icon: IconSettings,
        },
        {
          key: "teamerInfo",
          url: "/profile/teamer",
          icon: IconId,
          requiredRole: "teamer",
          children: [
            {
              key: "bankingDetails",
              url: "/profile/teamer/banking",
              icon: IconCreditCard,
              requiredRole: "teamer",
            },
            {
              key: "driverInfo",
              url: "/profile/teamer/driver",
              icon: IconCar,
              requiredRole: "teamer",
            },
          ],
        },
      ],
    },
    {
      key: "settings",
      url: "/settings",
      icon: IconSettings,
      children: [
        {
          key: "appearance",
          url: "/settings/appearance",
          icon: IconPaint,
        },
        {
          key: "language",
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
      [key: string]: string | undefined;
    };
    user?: {
      account: string;
      logout: string;
    };
  };
  lang?: Locale;
}

// Helper function to transform navigation items with localization
function transformNavItems(
  items: NavStructureItem[],
  dict?: AppSidebarProps["dict"],
  lang: Locale = "en",
): NavItem[] {
  return items.map((item) => {
    const title = dict?.navigation[item.key] || item.key;
    const url = `/${lang}${item.url}`;

    const transformed: NavItem = {
      title,
      url,
      icon: item.icon,
      requiredRole: item.requiredRole,
    };

    if (item.children) {
      transformed.children = transformNavItems(item.children, dict, lang);
    }

    return transformed;
  });
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

  // Transform navigation structure with localization
  const navMain = transformNavItems(navigationStructure.navMain, dict, lang);
  const navUser = transformNavItems(navigationStructure.navUser, dict, lang);

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
