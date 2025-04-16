-- Create a function to return the current database timestamp
CREATE OR REPLACE FUNCTION public.get_current_timestamp()
RETURNS TIMESTAMPTZ
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT now();
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.get_current_timestamp() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_timestamp() TO anon;
GRANT EXECUTE ON FUNCTION public.get_current_timestamp() TO service_role; 