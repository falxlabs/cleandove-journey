import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jsbvghwfvksfsozygkpc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzYnZnaHdmdmtzZnNvenlna3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NTQ0MDAsImV4cCI6MjAyNTIzMDQwMH0.SbUXk6cqZuaJLHbxO6J-w_YJGfqxUmNH0-RtUTlPglE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});