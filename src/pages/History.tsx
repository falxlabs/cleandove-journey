import { Star, MessageSquare, Calendar } from "lucide-react";

const History = () => {
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

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="px-6 py-8">
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-muted-foreground mt-1">Your past conversations</p>
      </header>

      <section className="px-6 space-y-4">
        {chats.map((chat) => (
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
  );
};

export default History;