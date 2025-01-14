import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskType: string;
  taskTitle: string;
  onComplete?: () => void;
  isCustomTask?: boolean;
}

const religiousQuotes = [
  "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future. - Jeremiah 29:11",
  "I can do all things through Christ who strengthens me. - Philippians 4:13",
  "Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5",
];

const motivationalQuotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The future depends on what you do today. - Mahatma Gandhi",
];

export function TaskDialog({ 
  open, 
  onOpenChange, 
  taskType, 
  taskTitle,
  onComplete,
  isCustomTask = false 
}: TaskDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: preferences } = useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('religious_content')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const getRandomQuote = () => {
    const quotes = preferences?.religious_content ? religiousQuotes : motivationalQuotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const handleShare = () => {
    const quote = getRandomQuote();
    if (navigator.share) {
      navigator.share({
        text: quote,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(quote);
      toast({
        description: "Quote copied to clipboard!",
      });
    }
  };

  const handleChatClick = () => {
    navigate("/conversation", {
      state: {
        topic: taskType,
        context: `Let's reflect on today's quote: ${getRandomQuote()}`,
      },
    });
    onOpenChange(false);
  };

  const handleDone = () => {
    onComplete?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{taskTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p className="text-lg font-medium text-center">{getRandomQuote()}</p>
          <div className="flex flex-col gap-4">
            <Button onClick={handleChatClick} className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat to Learn More
            </Button>
            <Button onClick={handleShare} variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={handleDone} className="w-full">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}