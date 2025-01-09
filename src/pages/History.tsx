import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import ChatList from "@/components/ChatList";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Chat } from "@/types/topics";

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: chats, isLoading } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Chat[];
    },
  });

  const filteredChats = chats?.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <PageHeader
        title="History"
        emoji="📚"
        description="Your past conversations"
      />

      <div className="px-6 space-y-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <ChatList chats={filteredChats || []} />
        )}
      </div>
    </div>
  );
};

export default History;