import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jsbvghwfvksfsozygkpc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzYnZnaHdmdmtzZnNvenlna3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDE0OTUsImV4cCI6MjA1MTY3NzQ5NX0.NYfW4K1nJhusFixYr3sWtGR1s7soj_QbhZeq_BWJxjs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});