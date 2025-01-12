import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ChristFocusedToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('religious_content')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading preferences:', error);
        return;
      }

      setEnabled(data?.religious_content ?? false);
      setIsLoading(false);
    };

    loadPreferences();
  }, []);

  const handleToggle = async (checked: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_preferences')
      .update({ religious_content: checked })
      .eq('user_id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        description: "Failed to update preference",
      });
      return;
    }

    setEnabled(checked);
    toast({
      description: "Christ-focused messages preference updated",
    });
  };

  if (isLoading) {
    return <div className="animate-pulse h-20 bg-muted rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Christ-Focused Messages</Label>
        <p className="text-sm text-muted-foreground">
          Enable to receive messages focused on Christian teachings with Bible verse references
        </p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
      />
    </div>
  );
};