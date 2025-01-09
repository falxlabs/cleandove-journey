import { supabase } from "@/integrations/supabase/client";

export async function checkCredits(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', session.user.id)
    .single();

  return profile?.credits ? profile.credits > 0 : false;
}

export async function deductCredit(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return false;

  const { data, error } = await supabase
    .rpc('decrement_credits');

  return !error && data !== null;
}