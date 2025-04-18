"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserWithRole, hasRole } from "@/lib/auth/roles";
import { UserRole } from "@/lib/types";

interface RoleGateProps {
  /**
   * The minimum role required to view the content
   */
  requiredRole: UserRole;
  /**
   * Content to display if the user has the required role
   */
  children: React.ReactNode;
  /**
   * Optional fallback to display if the user does not have the required role
   */
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders content based on the user's role
 */
export function RoleGate({
  requiredRole,
  children,
  fallback = null,
}: RoleGateProps) {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch the user's profile to get their role
        const { data: profile } = await supabase
          .from("profile")
          .select("role")
          .eq("id", user.id)
          .single();

        setUser({
          ...user,
          role: (profile?.role as UserRole) || "user",
        });
      }

      setLoading(false);
    };

    fetchUserRole();
  }, []);

  // Show nothing during initial load
  if (loading) return null;

  // Check if the user has the required role
  if (user && hasRole(user, requiredRole)) {
    return <>{children}</>;
  }

  // Return fallback if user doesn't have the required role
  return <>{fallback}</>;
}
