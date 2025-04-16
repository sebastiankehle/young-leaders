"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Locale } from "@/app/[lang]/dictionaries";

interface SiteHeaderProps {
  currentPath?: string;
  lang?: Locale;
}

export function SiteHeader({ currentPath, lang }: SiteHeaderProps) {
  // Use the provided currentPath or get it from the pathname
  const pathname = usePathname();
  const path = currentPath || pathname;

  // Extract the current page title from the pathname
  const getPageTitle = () => {
    // Remove leading slash and get the last segment
    // This handles both /dashboard and /en/dashboard cases
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment) return "Home";

    // Capitalize the first letter
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
      </div>
    </header>
  );
}
