import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PlanConfiguration {
  plan: string;
  daily_credits: number;
  description: string;
}

export const useSubscriptionDetails = () => {
  const session = useSession();

  return useQuery({
    queryKey: ["subscription", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("No authenticated user");
      }

      // First get the user's plan - no need to filter by user_id, RLS will handle that
      const { data: userPlan, error: userPlanError } = await supabase
        .from("user_plans")
        .select("plan, credits")
        .maybeSingle();

      if (userPlanError) {
        console.error("Error fetching user plan:", userPlanError);
        throw userPlanError;
      }

      // If no plan exists, return default free plan
      if (!userPlan) {
        return {
          plan: "free",
          daily_credits: 5,
          description: "Free tier with limited features",
          credits: 0
        };
      }

      // Then get the plan configuration
      const { data: planConfig, error: planConfigError } = await supabase
        .from("plan_configurations")
        .select("daily_credits, description")
        .eq("plan", userPlan.plan)
        .single();

      if (planConfigError) {
        console.error("Error fetching plan configuration:", planConfigError);
        throw planConfigError;
      }

      return {
        plan: userPlan.plan,
        daily_credits: planConfig.daily_credits,
        description: planConfig.description || `${userPlan.plan} plan`,
        credits: userPlan.credits
      };
    },
    enabled: !!session?.user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};