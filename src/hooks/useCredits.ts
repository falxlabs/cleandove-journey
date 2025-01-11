import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCredits = () => {
  const [credits, setCredits] = useState<number>(0);
  const MAX_CREDITS = 10;

  useEffect(() => {
    const fetchCredits = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setCredits(profile.credits);
        }
      }
    };

    fetchCredits();
  }, []);

  return { credits, MAX_CREDITS };
};