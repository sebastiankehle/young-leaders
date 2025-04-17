"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Locale } from "@/app/[lang]/dictionaries";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  lang: Locale;
  dict: {
    navigation: {
      personalInfo?: string;
      contactDetails?: string;
      address?: string;
      education?: string;
      preferences?: string;
      teamerInfo?: string;
      profile?: string;
      [key: string]: string | undefined;
    };
  };
  userRole?: string;
}

export function ProfileTabs({
  lang,
  dict,
  userRole = "user",
}: ProfileTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("personal");

  // Define tab items with their paths and icons using useMemo to prevent recreating on every render
  const tabs = useMemo(() => {
    const baseTabsItems = [
      {
        id: "personal",
        label: dict.navigation.personalInfo || "Personal Information",
        path: `/${lang}/profile/personal`,
      },
      {
        id: "contact",
        label: dict.navigation.contactDetails || "Contact Details",
        path: `/${lang}/profile/contact`,
      },
      {
        id: "address",
        label: dict.navigation.address || "Address",
        path: `/${lang}/profile/address`,
      },
      {
        id: "education",
        label: dict.navigation.education || "Education",
        path: `/${lang}/profile/education`,
      },
      {
        id: "preferences",
        label: dict.navigation.preferences || "Preferences",
        path: `/${lang}/profile/preferences`,
      },
    ];

    // Add teamer tab if user has teamer role
    if (userRole === "teamer" || userRole === "admin") {
      baseTabsItems.push({
        id: "teamer",
        label: dict.navigation.teamerInfo || "Teamer Information",
        path: `/${lang}/profile/teamer`,
      });
    }

    return baseTabsItems;
  }, [lang, dict.navigation, userRole]);

  // Update active tab based on current URL
  useEffect(() => {
    const path = pathname.split("/").pop() || "";
    if (tabs.some((tab) => tab.id === path)) {
      setActiveTab(path);
    } else if (
      pathname.includes("/profile") &&
      !pathname.includes("/profile/")
    ) {
      // If we're on the main profile page, select the first tab
      setActiveTab("personal");
    }
  }, [pathname, tabs]);

  // Handle tab change
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    const tab = tabs.find((t) => t.id === id);
    if (tab) {
      router.push(tab.path);
    }
  };

  return (
    <>
      <h1 className="mb-4 text-xl font-bold">
        {dict.navigation.profile || "Profile"}
      </h1>
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "hover:text-foreground relative mr-6 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground text-sm",
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="bg-primary absolute right-0 bottom-0 left-0 h-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
