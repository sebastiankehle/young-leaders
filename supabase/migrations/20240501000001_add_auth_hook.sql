-- Create the auth hook function to add user_role claim to JWT
CREATE OR REPLACE FUNCTION public.handle_user_role_jwt(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claims jsonb;
  user_role public.app_role;
BEGIN
  -- Fetch the user role from the user_roles table
  SELECT role INTO user_role 
  FROM public.user_roles 
  WHERE user_id = (event->>'user_id')::uuid;

  claims := event->'claims';
  
  -- Set the user_role claim
  IF user_role IS NOT NULL THEN
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  ELSE
    claims := jsonb_set(claims, '{user_role}', '"user"');
  END IF;
  
  -- Update the claims in the event
  event := jsonb_set(event, '{claims}', claims);
  
  RETURN event;
END;
$$;

-- Grant required permissions for Supabase Auth
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_user_role_jwt TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.handle_user_role_jwt FROM authenticated, anon, public;

-- Grant supabase_auth_admin access to user_roles table for the hook
GRANT SELECT ON TABLE public.user_roles TO supabase_auth_admin;

-- Add a comment explaining how to enable the hook in the Supabase Dashboard
COMMENT ON FUNCTION public.handle_user_role_jwt IS 
'Auth hook to add user_role to JWT claims. Enable this hook in the Supabase Dashboard:
1. Go to Authentication > Hooks (Beta)
2. Select "handle_user_role_jwt" from the dropdown menu for "Custom Access Token"'; 