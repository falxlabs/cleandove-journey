import { useSubscriptionDetails } from "@/hooks/useSubscriptionDetails";
import { Skeleton } from "@/components/ui/skeleton";

export const PearlIndicator = () => {
  const { data: subscription, isLoading } = useSubscriptionDetails();

  if (isLoading) {
    return <Skeleton className="h-10 w-20" />;
  }

  return (
    <div className="flex items-center gap-1 px-4 py-2 text-muted-foreground">
      <span className="text-xl">💠</span>
      <span className="text-sm">{subscription?.credits || 0}</span>
    </div>
  );
};