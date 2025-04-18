import { createClient } from "@/lib/supabase/server";
import { UserWithRole } from "./roles";
import { redirect } from "next/navigation";
import { UserRole } from "../types";

/**
 * Gets the current user with their role from the database
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch the user's role from the user_roles table
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return {
    ...user,
    // If no role is found, default to "user"
    role: (userRole?.role as UserRole) || "user",
  };
}

/**
 * Server-side function to check if the current user has the required role
 * If not, redirects to the specified page
 */
export async function requireRole(
  role: UserRole,
  redirectTo: string = "/auth/login",
): Promise<UserWithRole> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  const userRole = user.role || "user";
  let hasAccess = false;

  switch (role) {
    case "user":
      hasAccess = true;
      break;
    case "teamer":
      hasAccess = userRole === "teamer" || userRole === "admin";
      break;
    case "admin":
      hasAccess = userRole === "admin";
      break;
  }

  if (!hasAccess) {
    redirect("/"); // Redirect to dashboard if user doesn't have access
  }

  return user;
}
