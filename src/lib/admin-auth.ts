import { createClient } from "@/lib/supabase/server";

export async function getPortfolioAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: isAdmin, error } = await supabase.rpc("is_portfolio_admin");
  if (error || isAdmin !== true) return null;

  return { supabase, user };
}
