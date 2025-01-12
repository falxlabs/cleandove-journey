import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PlanConfiguration {
  plan: string;
  daily_credits: number;
  description: string | null;
}

export const useSubscriptionDetails = () => {
  const { data: currentPlan } = useQuery({
    queryKey: ["userPlan"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data } = await supabase
        .from("user_plans")
        .select("plan")
        .eq("user_id", session.user.id)
        .maybeSingle();

      return data?.plan || "free";
    },
  });

  const { data: planDetails } = useQuery({
    queryKey: ["planConfiguration", currentPlan],
    queryFn: async () => {
      const { data } = await supabase
        .from("plan_configurations")
        .select("*")
        .eq("plan", currentPlan)
        .maybeSingle();

      return data as PlanConfiguration;
    },
    enabled: !!currentPlan,
  });

  return {
    currentPlan,
    planDetails,
  };
};