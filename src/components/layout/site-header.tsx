"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Locale } from "@/app/[lang]/dictionaries";
import { IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

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

export function SiteHeader({ lang = "en", dict }: SiteHeaderProps) {
  // Get the current path from the pathname
  const pathname = usePathname();

  // Create breadcrumb segments
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
    const breadcrumbs = [];
    let currentPath = `/${lang}`;

    // Build path for each segment and create breadcrumb
    for (let i = 0; i < filteredSegments.length; i++) {
      const segment = filteredSegments[i];
      currentPath += `/${segment}`;
      const isLast = i === filteredSegments.length - 1;

      // Get label with simple capitalization as fallback
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Try to get localized name from dictionary
      if (dict?.navigation && dict.navigation[segment]) {
        label = dict.navigation[segment];
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isCurrent: isLast,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't render the breadcrumb navigation if there are no breadcrumbs
  if (breadcrumbs.length === 0) {
    return (
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
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
    </header>
  );
}
