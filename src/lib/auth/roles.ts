import { Session, User } from "@supabase/supabase-js";
import { UserRole } from "@/lib/types";

export interface UserWithRole extends User {
  role?: UserRole;
}

export interface SessionWithRole extends Session {
  user: UserWithRole;
}

/**
 * Checks if a user has at least the specified role level
 */
export function hasRole(user: UserWithRole | null, role: UserRole): boolean {
  if (!user) return false;

  const userRole = user.role || "user";

  switch (role) {
    case "user":
      return true; // All authenticated users have at least "user" role
    case "teamer":
      return userRole === "teamer" || userRole === "admin";
    case "admin":
      return userRole === "admin";
    default:
      return false;
  }
}

/**
 * Checks if a user is an admin
 */
export function isAdmin(user: UserWithRole | null): boolean {
  return hasRole(user, "admin");
}

/**
 * Checks if a user is a teamer or higher
 */
export function isTeamer(user: UserWithRole | null): boolean {
  return hasRole(user, "teamer");
}

/**
 * Returns the role of a user, defaulting to "user" if not found
 */
export function getUserRole(user: UserWithRole | null): UserRole {
  return user?.role || "user";
}
