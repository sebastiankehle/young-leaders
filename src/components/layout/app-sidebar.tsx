"use client";

import React from "react";
import {
  IconCalendarEvent,
  IconDashboard,
  IconCalendar,
  IconClock,
  IconClipboardList,
  IconBuildingSkyscraper,
  IconAnalyze,
  IconClipboardData,
  IconPlus,
  IconChartBar,
  IconSwitch3,
  IconFileCheck,
  IconArchive,
  type Icon,
} from "@tabler/icons-react";
import { Locale } from "@/app/[lang]/dictionaries";
import Image from "next/image";

import { NavItem, NavGroup } from "@/components/layout/nav-group";
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
import { Switch } from "@/components/ui/switch";
import { UserRole } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/auth/client";

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
  navDashboard: NavStructureItem[];
  navUser: NavStructureItem[];
  navAdmin: NavStructureItem[];
} = {
  navDashboard: [
    {
      key: "dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ],
  navUser: [
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
          icon: IconFileCheck,
        },
        {
          key: "pastApplications",
          url: "/applications/past-applications",
          icon: IconArchive,
        },
      ],
    },
  ],

  navAdmin: [
    {
      key: "adminEvents",
      url: "/admin/events",
      icon: IconCalendarEvent,
      requiredRole: "admin",
      children: [
        {
          key: "createEvent",
          url: "/admin/events/create-event",
          icon: IconPlus,
          requiredRole: "admin",
        },
        {
          key: "manageEvents",
          url: "/admin/events/manage-events",
          icon: IconClipboardData,
          requiredRole: "admin",
        },
        {
          key: "eventAnalytics",
          url: "/admin/events/analytics",
          icon: IconChartBar,
          requiredRole: "admin",
        },
      ],
    },

    {
      key: "adminApplications",
      url: "/admin/applications",
      icon: IconClipboardList,
      requiredRole: "admin",
      children: [
        {
          key: "manageApplications",
          url: "/admin/applications/manage-applications",
          icon: IconClipboardData,
          requiredRole: "admin",
        },
        {
          key: "compareApplications",
          url: "/admin/applications/compare-applications",
          icon: IconAnalyze,
          requiredRole: "admin",
        },
      ],
    },
    {
      key: "adminSchools",
      url: "/admin/schools",
      icon: IconBuildingSkyscraper,
      requiredRole: "admin",
      children: [
        {
          key: "manageSchools",
          url: "/admin/schools/manage-schools",
          icon: IconClipboardData,
          requiredRole: "admin",
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
      // Admin section
      adminEvents?: string;
      createEvent?: string;
      manageEvents?: string;
      eventAnalytics?: string;
      adminSchools?: string;
      manageSchools?: string;
      adminApplications?: string;
      manageApplications?: string;
      compareApplications?: string;
      // Group labels
      userNavigation?: string;
      adminNavigation?: string;
      adminView?: string;
      userView?: string;
      darkMode?: string;
      lightMode?: string;
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
    role: "" as UserRole,
    id: "",
  });
  const [isAdminView, setIsAdminView] = React.useState(false);

  const refreshUserData = async () => {
    // Use the getCurrentUser function from client.ts
    const user = await getCurrentUser();

    if (user) {
      setUserData({
        name: user.email?.split("@")[0] || "User",
        email: user.email || "",
        role: user.role || "user", // Now using the role from getCurrentUser
        id: user.id,
      });
    }
  };

  React.useEffect(() => {
    refreshUserData();
  }, []);

  // Transform navigation structure with localization
  const navDashboard = transformNavItems(
    navigationStructure.navDashboard,
    dict,
    lang,
  );
  const navUser = transformNavItems(navigationStructure.navUser, dict, lang);
  const navAdmin = transformNavItems(navigationStructure.navAdmin, dict, lang);

  // Get translated group labels or use defaults
  const mainNavigationLabel = dict?.navigation.mainNavigation || "Welcome";
  const userNavigationLabel = dict?.navigation.userNavigation || "User";
  const adminNavigationLabel = dict?.navigation.adminNavigation || "Admin";
  const adminViewLabel = dict?.navigation.adminView || "Admin View";
  const userViewLabel = dict?.navigation.userView || "User View";

  // Create user dictionary with additional terms for the dropdown
  const userDict = {
    account: dict?.user?.account || "Account",
    logout: dict?.user?.logout || "Log out",
    profile: dict?.navigation.profile || "Profile",
    theme: dict?.navigation.theme || "Theme",
    language: dict?.navigation.language || "Language",
    darkMode: dict?.navigation.darkMode || "Dark Mode",
    lightMode: dict?.navigation.lightMode || "Light Mode",
  };

  const isAdmin = userData.role === "admin";

  console.log("Current user role:", userData.role); // Debug log

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:!bg-transparent data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href={lang ? `/${lang}/dashboard` : "/dashboard"}>
                <Image
                  src="/images/yl_vektor.png"
                  alt="young leaders Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="text-base font-semibold">young leaders</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Dashboard is always shown */}
        <NavGroup items={navDashboard} label={mainNavigationLabel} />

        {/* Main navigation or Admin navigation based on view */}
        {(!isAdminView || !isAdmin) && (
          <NavGroup items={navUser} label={userNavigationLabel} />
        )}
        {isAdminView && isAdmin && (
          <NavGroup items={navAdmin} label={adminNavigationLabel} />
        )}
      </SidebarContent>
      <SidebarFooter className="flex flex-col">
        {isAdmin && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip={isAdminView ? adminViewLabel : userViewLabel}
                onClick={() => setIsAdminView(!isAdminView)}
                className="flex-1"
              >
                <IconSwitch3 className="size-4" />
                <span>{isAdminView ? adminViewLabel : userViewLabel}</span>
              </SidebarMenuButton>
              <div className="pr-2 group-data-[collapsible=icon]:hidden">
                <Switch
                  checked={isAdminView}
                  onCheckedChange={setIsAdminView}
                  aria-label="Toggle admin view"
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <NavUser user={userData} dict={userDict} lang={lang} />
      </SidebarFooter>
    </Sidebar>
  );
}
