import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterButtons from "@/components/FilterButtons";
import ChatList from "@/components/ChatList";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ChatHistory = Database['public']['Tables']['chat_histories']['Row'];

const History = () => {
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: chats = [], isLoading } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("chat_histories")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching chat histories:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load chat history.",
        });
        throw error;
      }

      return data.map((chat: ChatHistory) => ({
        id: chat.id,
        title: chat.title,
        preview: chat.preview || "",
        date: format(new Date(chat.created_at), "PP"),
        replies: Number(chat.reply_count) || 0,
        favorite: chat.favorite || false,
      }));
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const filteredChats = chats
    .filter((chat) => filter === "all" || (filter === "favorites" && chat.favorite))
    .filter(
      (chat) =>
        searchQuery === "" ||
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <PageHeader
          title="History"
          emoji="🕊️"
          description="Let's look back at our previous conversations"
        />

        <div className="px-6 space-y-4 pb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} isLoading={isLoading} />
          <FilterButtons filter={filter} onFilterChange={setFilter} isLoading={isLoading} />
        </div>
      </div>

      <div className="px-6 pt-4">
        <ChatList chats={filteredChats} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default History;