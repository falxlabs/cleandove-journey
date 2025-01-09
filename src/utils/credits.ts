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

export async function updateRepliesCount(chatId: string): Promise<boolean> {
  const { data: aiMessages, error: countError } = await supabase
    .from('messages')
    .select('id')
    .eq('chat_id', chatId)
    .eq('sender', 'assistant');

  if (countError) return false;

  const replyCount = aiMessages?.length || 0;

  const { error: updateError } = await supabase
    .from('chat_histories')
    .update({ reply_count: replyCount })
    .eq('id', chatId);

  return !updateError;
}