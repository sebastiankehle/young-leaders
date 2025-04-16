import { createClient } from "@/lib/supabase/client";
import { UserRole, UserWithRole } from "./roles";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  user_role?: UserRole;
  [key: string]: string | number | boolean | null | undefined | UserRole;
}

/**
 * Gets the current user with their role from the client-side
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const { user } = session;
  console.log("Auth session user:", user.id);

  try {
    // Try to get the role from the JWT token (if auth hook is enabled)
    const jwt = jwtDecode<JwtPayload>(session.access_token);
    console.log("JWT payload:", jwt);
    const roleFromJwt = jwt.user_role;

    if (roleFromJwt) {
      console.log("Found role in JWT:", roleFromJwt);
      return {
        ...user,
        role: roleFromJwt,
      };
    }
  } catch (error) {
    console.error("Error decoding JWT:", error);
  }

  // If JWT doesn't have the role or decoding fails, fall back to database query
  const { data: userRole, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  console.log("Database role query:", { userRole, error });

  return {
    ...user,
    role: (userRole?.role as UserRole) || "user",
  };
}

/**
 * Client-side function to check if the current user has the required role
 */
export async function hasRequiredRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const userRole = user.role || "user";

  switch (role) {
    case "user":
      return true;
    case "teamer":
      return userRole === "teamer" || userRole === "admin";
    case "admin":
      return userRole === "admin";
    default:
      return false;
  }
}
