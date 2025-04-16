"use client";

import { useState } from "react";
import { type Icon } from "@tabler/icons-react";
import { IconChevronDown } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
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

export function NavMain({
  items,
  label = "Main Navigation",
}: {
  items: NavItem[];
  label?: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.children ? (
                <SubmenuItem key={item.url} item={item} />
              ) : (
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link
                    href={item.url}
                    className="flex cursor-pointer items-center gap-2"
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

function SubmenuItem({ item }: { item: NavItem }) {
  const router = useRouter();
  const { state: sidebarState } = useSidebar();

  // Start with submenus collapsed by default
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = () => {
    router.push(item.url);
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
      <SidebarMenuButton tooltip={item.title} className="justify-between">
        <div
          className="flex flex-1 cursor-pointer items-center gap-2"
          onClick={handleItemClick}
        >
          {item.icon && <item.icon className="size-4" />}
          <span>{item.title}</span>
        </div>
        <div
          className="flex cursor-pointer items-center p-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
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
              <NestedSubmenuItem key={child.title} item={child} />
            ) : (
              <Link
                key={child.title}
                href={child.url}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
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

function NestedSubmenuItem({ item }: { item: NavItem }) {
  const router = useRouter();
  const { state: sidebarState } = useSidebar();

  // Start with nested submenus closed by default
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = () => {
    router.push(item.url);
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
        className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-between rounded-md px-2 py-1.5 text-sm"
        onClick={handleItemClick}
      >
        <div className="flex items-center gap-2">
          {item.icon && <item.icon className="size-3.5" />}
          <span>{item.title}</span>
        </div>
        <div
          className="flex cursor-pointer items-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
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
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
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
