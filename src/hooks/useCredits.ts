import { useState, useEffect } from "react";
import { checkCredits, deductCredit } from "@/utils/credits";
import { supabase } from "@/integrations/supabase/client";

export const MAX_CREDITS = 5;

export const useCredits = () => {
  const [showCreditAlert, setShowCreditAlert] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchCredits = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data: userPlan } = await supabase
        .from('user_plans')
        .select('credits')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (userPlan) {
        setCredits(userPlan.credits);
      }
    };

    fetchCredits();
  }, []);

  const handleCredits = async () => {
    const hasCredits = await checkCredits();
    if (!hasCredits) {
      setShowCreditAlert(true);
      return false;
    }
    const creditDeducted = await deductCredit();
    if (creditDeducted) {
      setCredits(prev => prev - 1);
    }
    return creditDeducted;
  };

  return {
    showCreditAlert,
    setShowCreditAlert,
    handleCredits,
    credits,
    MAX_CREDITS,
  };
};