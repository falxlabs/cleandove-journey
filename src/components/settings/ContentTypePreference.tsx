import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ContentTypePreference = () => {
  const [readingType, setReadingType] = useState<string>("both");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: preferences, error } = await supabase
          .from('user_preferences')
          .select('reading_type')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading preferences:', error);
          toast({
            variant: "destructive",
            description: "Failed to load preferences",
          });
          return;
        }

        if (!preferences) {
          // Create default preferences if they don't exist
          const { error: insertError } = await supabase
            .from('user_preferences')
            .insert([{ 
              user_id: user.id,
              reading_type: 'both'
            }]);

          if (insertError) {
            console.error('Error creating preferences:', insertError);
            toast({
              variant: "destructive",
              description: "Failed to create preferences",
            });
            return;
          }
          setReadingType('both');
        } else {
          setReadingType(preferences.reading_type);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          variant: "destructive",
          description: "An error occurred while loading preferences",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [toast]);

  const handleValueChange = async (value: string) => {
    if (!value) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_preferences')
        .update({ reading_type: value })
        .eq('user_id', user.id);

      if (error) {
        toast({
          variant: "destructive",
          description: "Failed to update preference",
        });
        return;
      }

      setReadingType(value);
      toast({
        description: "Reading type preference updated",
      });
    } catch (error) {
      console.error('Error updating preference:', error);
      toast({
        variant: "destructive",
        description: "Failed to update preference",
      });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-20 bg-muted rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Daily Reading Type</Label>
        <p className="text-sm text-muted-foreground">
          Choose what type of content you'd like to see in your daily readings
        </p>
      </div>
      <ToggleGroup
        type="single"
        value={readingType}
        onValueChange={handleValueChange}
        className="justify-start"
      >
        <ToggleGroupItem value="verses" className="gap-2">
          Bible Verses Only
        </ToggleGroupItem>
        <ToggleGroupItem value="both" className="gap-2">
          Bible Verses & Quotes
        </ToggleGroupItem>
        <ToggleGroupItem value="quotes" className="gap-2">
          Quotes Only
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};