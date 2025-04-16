import { createClient } from "@/lib/supabase/server";
import { UserRole, UserWithRole } from "./roles";
import { redirect } from "next/navigation";

/**
 * Gets the current user with their role from the database
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch the user's profile which contains the role
  const { data: profile } = await supabase
    .from("profile")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    ...user,
    role: (profile?.role as UserRole) || "user",
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
    redirect("/dashboard"); // Redirect to dashboard if user doesn't have access
  }

  return user;
}
