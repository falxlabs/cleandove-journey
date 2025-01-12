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
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession?.user?.id) {
        throw new Error("No authenticated user");
      }

      // First get the user's plan
      const { data: userPlan, error: userPlanError } = await supabase
        .from("user_plans")
        .select("*")
        .eq("user_id", currentSession.user.id)
        .maybeSingle();

      if (userPlanError) {
        console.error("Error fetching user plan:", userPlanError);
        throw userPlanError;
      }

      if (!userPlan) {
        return {
          plan: "free",
          daily_credits: 5, // Updated to match our new configuration
          description: "Free tier with limited features"
        };
      }

      // Then get the plan configuration
      const { data: planConfig, error: planConfigError } = await supabase
        .from("plan_configurations")
        .select("*")
        .eq("plan", userPlan.plan)
        .single();

      if (planConfigError) {
        console.error("Error fetching plan configuration:", planConfigError);
        throw planConfigError;
      }

      return {
        plan: userPlan.plan,
        daily_credits: planConfig.daily_credits,
        description: planConfig.description || `${userPlan.plan} plan`
      };
    },
    enabled: !!session?.user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};