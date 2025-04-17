"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Locale } from "@/app/[lang]/dictionaries";
import {
  IconChevronRight,
  IconWorld,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ServerTime } from "@/components/ui/server-time";

// Map URL segments to dictionary keys
const segmentToKeyMap: Record<string, string> = {
  dashboard: "dashboard",
  events: "events",
  "current-events": "currentEvents",
  "past-events": "pastEvents",
  applications: "applications",
  "current-applications": "currentApplications",
  "past-applications": "pastApplications",
  profile: "profile",
  personal: "personalInfo",
  contact: "contactDetails",
  address: "address",
  education: "education",
  preferences: "preferences",
  teamer: "teamerInfo",
  banking: "bankingInfo",
  driver: "driverInfo",
  settings: "settings",
  appearance: "appearance",
  language: "language",
};

interface SiteHeaderProps {
  lang?: Locale;
  dict?: {
    navigation: {
      dashboard: string;
      events: string;
      settings: string;
      theme: string;
      language: string;
      [key: string]: string;
    };
    header: {
      home: string;
      [key: string]: string;
    };
    [key: string]: Record<string, string> | undefined;
  };
}

interface Breadcrumb {
  label: string;
  path: string;
  isCurrent: boolean;
}

export function SiteHeader({ lang = "en", dict }: SiteHeaderProps) {
  // Get the current path from the pathname
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  // Move breadcrumb generation to useEffect to ensure it only runs on the client
  useEffect(() => {
    const getBreadcrumbs = () => {
      // Remove leading slash and filter empty segments
      const segments = pathname.split("/").filter(Boolean);

      // Filter out language segment if present
      const filteredSegments = segments.filter((segment) => segment !== lang);

      // If no segments remain, we're at the root
      if (filteredSegments.length === 0) {
        return [];
      }

      // Create breadcrumb items
      const breadcrumbItems: Breadcrumb[] = [];
      let currentPath = `/${lang}`;

      // Build path for each segment and create breadcrumb
      for (let i = 0; i < filteredSegments.length; i++) {
        const segment = filteredSegments[i];
        currentPath += `/${segment}`;
        const isLast = i === filteredSegments.length - 1;

        // Get label with simple capitalization as fallback
        let label = segment.charAt(0).toUpperCase() + segment.slice(1);

        // Try to get localized name from dictionary using the segment-to-key map
        const dictKey = segmentToKeyMap[segment];
        if (dictKey && dict?.navigation && dict.navigation[dictKey]) {
          label = dict.navigation[dictKey];
        }

        breadcrumbItems.push({
          label,
          path: currentPath,
          isCurrent: isLast,
        });
      }

      return breadcrumbItems;
    };

    setBreadcrumbs(getBreadcrumbs());
  }, [pathname, lang, dict]);

  // Don't render the breadcrumb navigation if there are no breadcrumbs
  if (breadcrumbs.length === 0) {
    return (
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
          <div className="flex items-center gap-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </div>

          {/* Right side icons with server time */}
          <div className="flex items-center gap-3">
            <ServerTime lang={lang} />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <Link
              href="https://young-leaders.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconWorld className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Visit Young Leaders Website</span>
              </Button>
            </Link>

            <Link
              href="https://www.instagram.com/youngleadersgmbh/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconBrandInstagram className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Young Leaders Instagram</span>
              </Button>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center text-sm">
                  {index > 0 && (
                    <IconChevronRight className="text-muted-foreground mx-1 size-3 shrink-0" />
                  )}
                  <Link
                    href={crumb.path}
                    className={cn(
                      "hover:text-foreground transition-colors",
                      crumb.isCurrent
                        ? "text-foreground font-medium"
                        : "text-muted-foreground",
                    )}
                    aria-current={crumb.isCurrent ? "page" : undefined}
                  >
                    {crumb.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Right side icons with server time */}
        <div className="flex items-center gap-3">
          <ServerTime lang={lang} />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Link
            href="https://young-leaders.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <IconWorld className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Visit Young Leaders Website</span>
            </Button>
          </Link>

          <Link
            href="https://www.instagram.com/youngleadersgmbh/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <IconBrandInstagram className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Young Leaders Instagram</span>
            </Button>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
