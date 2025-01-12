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

      // First check if preferences exist
      const { data: existingPrefs, error: checkError } = await supabase
        .from('user_preferences')
        .select('religious_content')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking preferences:', checkError);
        return;
      }

      // If no preferences exist, create them
      if (!existingPrefs) {
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert([{ user_id: user.id }]);

        if (insertError) {
          console.error('Error creating preferences:', insertError);
          return;
        }
      } else {
        setEnabled(existingPrefs.religious_content);
      }

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