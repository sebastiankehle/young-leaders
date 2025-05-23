"use client";

import { useState, useEffect } from "react";
import { type Icon } from "@tabler/icons-react";
import { IconChevronDown } from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  url: string;
  icon?: Icon;
  children?: NavItem[];
  requiredRole?: "user" | "teamer" | "admin";
}

export function NavGroup({
  items,
  label,
}: {
  items: NavItem[];
  label?: string;
}) {
  const pathname = usePathname();

  // Helper function to check if a path is active
  const isActive = (url: string) => {
    // Remove lang prefix from pathname for comparison
    const normalizedPathname = pathname.replace(/^\/[a-z]{2}\//, "/");
    const normalizedUrl = url.replace(/^\/[a-z]{2}\//, "/");

    // Check if the path is exact match or starts with the URL (for parent routes)
    return (
      normalizedPathname === normalizedUrl ||
      (normalizedUrl !== "/" && normalizedPathname.startsWith(normalizedUrl))
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.children ? (
                <SubmenuItem key={item.url} item={item} isActive={isActive} />
              ) : (
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive(item.url)}
                >
                  <Link
                    href={item.url}
                    className={cn(
                      "flex cursor-pointer items-center gap-2",
                      isActive(item.url) && "font-medium",
                    )}
                  >
                    {item.icon && <item.icon className="size-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function SubmenuItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: (url: string) => boolean;
}) {
  const router = useRouter();
  const { state: sidebarState } = useSidebar();
  const pathname = usePathname();

  // Check if this item or any of its children are active
  const isItemActive = isActive(item.url);
  const isAnyChildActive = item.children?.some(
    (child) =>
      isActive(child.url) ||
      child.children?.some((grandchild) => isActive(grandchild.url)),
  );

  // Start with submenus expanded if they contain the active item
  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  // Re-check active state when pathname changes
  useEffect(() => {
    const shouldBeOpen = isAnyChildActive;
    if (shouldBeOpen && !isOpen) {
      setIsOpen(true);
    }
  }, [pathname, isAnyChildActive, isOpen]);

  const handleItemClick = (e: React.MouseEvent) => {
    // Prevent click from being handled by parent elements
    e.stopPropagation();
    router.push(item.url);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    // Prevent navigation and parent click handlers
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Filter children based on their requiredRole property
  const filteredChildren = item.children?.filter((child) => {
    // If no requiredRole is specified, always show the item
    if (!child.requiredRole) return true;

    // Otherwise, we would check if the user has the required role
    // This is a placeholder - in a real implementation, you would
    // check against the actual user role from auth context
    return true; // For now, show all items
  });

  // Check if sidebar is collapsed to hide content appropriately
  const isSidebarCollapsed = sidebarState === "collapsed";

  return (
    <>
      <SidebarMenuButton
        tooltip={item.title}
        className="justify-between"
        isActive={isItemActive || isAnyChildActive}
      >
        <div
          className={cn(
            "flex flex-1 cursor-pointer items-center gap-2",
            (isItemActive || isAnyChildActive) && "font-medium",
          )}
          onClick={handleItemClick}
        >
          {item.icon && <item.icon className="size-4" />}
          <span>{item.title}</span>
        </div>
        <div
          className="flex cursor-pointer items-center p-1"
          onClick={handleToggleClick}
        >
          <IconChevronDown
            className={cn(
              "size-3.5 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </SidebarMenuButton>

      {/* Only show submenu content if sidebar is expanded and the menu is open */}
      {isOpen && !isSidebarCollapsed && filteredChildren && (
        <div className="border-border mt-1 ml-4 flex flex-col gap-1 border-l pl-2">
          {filteredChildren.map((child) =>
            child.children ? (
              <NestedSubmenuItem
                key={child.title}
                item={child}
                isActive={isActive}
              />
            ) : (
              <Link
                key={child.title}
                href={child.url}
                className={cn(
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                  isActive(child.url) &&
                    "bg-accent text-accent-foreground font-medium",
                )}
              >
                {child.icon && <child.icon className="size-3.5" />}
                <span>{child.title}</span>
              </Link>
            ),
          )}
        </div>
      )}
    </>
  );
}

function NestedSubmenuItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: (url: string) => boolean;
}) {
  const router = useRouter();
  const { state: sidebarState } = useSidebar();
  const pathname = usePathname();

  // Check if this item or any of its children are active
  const isItemActive = isActive(item.url);
  const isAnyChildActive = item.children?.some((child) => isActive(child.url));

  // Start with nested submenus expanded if they contain the active item
  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  // Re-check active state when pathname changes
  useEffect(() => {
    const shouldBeOpen = isAnyChildActive;
    if (shouldBeOpen && !isOpen) {
      setIsOpen(true);
    }
  }, [pathname, isAnyChildActive, isOpen]);

  const handleItemClick = (e: React.MouseEvent) => {
    // Prevent click from being handled by parent elements
    e.stopPropagation();
    router.push(item.url);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    // Prevent navigation and parent click handlers
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Filter children based on their requiredRole property
  const filteredChildren = item.children?.filter((child) => {
    // If no requiredRole is specified, always show the item
    if (!child.requiredRole) return true;

    // Otherwise, we would check if the user has the required role
    return true; // For now, show all items
  });

  // Check if sidebar is collapsed to hide content appropriately
  const isSidebarCollapsed = sidebarState === "collapsed";

  return (
    <div className="mb-1">
      <div
        className={cn(
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-between rounded-md px-2 py-1.5 text-sm",
          (isItemActive || isAnyChildActive) &&
            "bg-accent text-accent-foreground font-medium",
        )}
      >
        <div className="flex items-center gap-2" onClick={handleItemClick}>
          {item.icon && <item.icon className="size-3.5" />}
          <span>{item.title}</span>
        </div>
        <div
          className="flex cursor-pointer items-center"
          onClick={handleToggleClick}
        >
          <IconChevronDown
            className={cn(
              "size-3 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>

      {/* Only show submenu content if sidebar is expanded and the menu is open */}
      {isOpen && !isSidebarCollapsed && filteredChildren && (
        <div className="border-border mt-1 ml-2 flex flex-col gap-1 border-l pl-2">
          {filteredChildren.map((child) => (
            <Link
              key={child.title}
              href={child.url}
              className={cn(
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                isActive(child.url) &&
                  "bg-accent text-accent-foreground font-medium",
              )}
            >
              {child.icon && <child.icon className="size-3.5" />}
              <span>{child.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
