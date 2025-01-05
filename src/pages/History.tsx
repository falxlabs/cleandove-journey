import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterButtons from "@/components/FilterButtons";
import ChatList from "@/components/ChatList";

const History = () => {
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const chats = [
    {
      id: 1,
      title: "Morning Reflection",
      preview: "Today I focused on gratitude and...",
      date: "Today",
      replies: 5,
      favorite: true,
    },
    {
      id: 2,
      title: "Overcoming Challenges",
      preview: "We discussed strategies for...",
      date: "Yesterday",
      replies: 8,
      favorite: false,
    },
    {
      id: 3,
      title: "Evening Prayer",
      preview: "Grateful for the blessings...",
      date: "2 days ago",
      replies: 3,
      favorite: true,
    },
  ];

  const filteredChats = chats
    .filter((chat) => filter === "all" || (filter === "favorites" && chat.favorite))
    .filter(
      (chat) =>
        searchQuery === "" ||
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <PageHeader
        title="History"
        emoji="🕊️"
        description="Let's look back at our previous conversations"
      />

      <div className="px-6 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterButtons filter={filter} onFilterChange={setFilter} />
        <ChatList chats={filteredChats} />
      </div>
    </div>
  );
};

export default History;