import { supabase } from "@/integrations/supabase/client";

export async function checkCredits(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return false;

  const { data: userPlan } = await supabase
    .from('user_plans')
    .select('credits')
    .eq('user_id', session.user.id)
    .maybeSingle();

  return userPlan?.credits ? userPlan.credits > 0 : false;
}

export async function deductCredit(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return false;

  const { data, error } = await supabase
    .rpc('decrement_credits');

  return !error && data !== null;
}