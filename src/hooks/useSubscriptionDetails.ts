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

      // Get the user's plan with user_id filter to satisfy RLS policy
      const { data: userPlan, error: userPlanError } = await supabase
        .from("user_plans")
        .select("plan, credits")
        .eq("user_id", session.user.id)
        .single();

      if (userPlanError) {
        console.error("Error fetching user plan:", userPlanError);
        throw userPlanError;
      }

      // If no plan exists, this shouldn't happen due to our trigger, but just in case
      if (!userPlan) {
        console.warn("No user plan found, this shouldn't happen due to our trigger");
        return {
          plan: "free",
          daily_credits: 5,
          description: "Free tier with limited features",
          credits: 0
        };
      }

      // Get the plan configuration
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