"use client";

import { useState } from "react";
import { type Icon } from "@tabler/icons-react";
import { IconChevronDown } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon?: Icon;
  children?: NavItem[];
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
                <SubmenuItem item={item} />
              ) : (
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a
                    href={item.url}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    {item.icon && <item.icon className="size-4" />}
                    <span>{item.title}</span>
                  </a>
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
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleItemClick = () => {
    router.push(item.url);
  };

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

      {isOpen && item.children && (
        <div className="border-border mt-1 ml-7 flex flex-col gap-1 border-l pl-2">
          {item.children.map((child) => (
            <a
              key={child.title}
              href={child.url}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
            >
              {child.icon && <child.icon className="size-3.5" />}
              <span>{child.title}</span>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
