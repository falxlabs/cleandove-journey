import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PlanConfiguration {
  plan: string;
  daily_credits: number;
  description: string | null;
}

export const useSubscriptionDetails = () => {
  const { data: currentPlan, isLoading: isPlanLoading } = useQuery({
    queryKey: ["userPlan"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data } = await supabase
        .from("user_plans")
        .select("plan")
        .eq("user_id", session.user.id)
        .single();

      return data?.plan || "free";
    },
  });

  const { data: planDetails, isLoading: isPlanDetailsLoading } = useQuery({
    queryKey: ["planConfiguration", currentPlan],
    queryFn: async () => {
      if (!currentPlan) return null;
      
      const { data } = await supabase
        .from("plan_configurations")
        .select("*")
        .eq("plan", currentPlan)
        .single();

      if (!data) {
        // Return default free plan configuration if no configuration is found
        return {
          plan: currentPlan,
          daily_credits: 10,
          description: "Free plan with limited daily messages"
        } as PlanConfiguration;
      }

      return data as PlanConfiguration;
    },
    enabled: !!currentPlan,
  });

  return {
    currentPlan,
    planDetails,
    isLoading: isPlanLoading || isPlanDetailsLoading,
  };
};