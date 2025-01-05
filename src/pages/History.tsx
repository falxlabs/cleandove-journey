import { Star, MessageSquare, Calendar, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <header className="px-6 py-8">
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-muted-foreground mt-1">Your past conversations</p>
      </header>

      <div className="px-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="flex-1"
          >
            All Chats
          </Button>
          <Button
            variant={filter === "favorites" ? "default" : "outline"}
            onClick={() => setFilter("favorites")}
            className="flex-1"
          >
            Favorites
          </Button>
        </div>

        <section className="space-y-4">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{chat.title}</h3>
                <button
                  className={`p-1 rounded-full transition-colors ${
                    chat.favorite
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Star className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{chat.preview}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{chat.date}</span>
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{chat.replies} replies</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default History;