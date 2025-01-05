import { useState } from "react";
import { ChevronRight } from "lucide-react";

const Chat = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = [
    {
      id: "new",
      title: "Start New Chat",
      description: "Begin a fresh conversation",
      primary: true,
    },
    {
      id: "anxiety",
      title: "Dealing with Anxiety",
      description: "Find peace and clarity",
    },
    {
      id: "habits",
      title: "Building Good Habits",
      description: "Create lasting change",
    },
    {
      id: "purpose",
      title: "Finding Purpose",
      description: "Discover your calling",
    },
  ];

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="px-6 py-8">
        <h1 className="text-2xl font-semibold">Start Chat</h1>
        <p className="text-muted-foreground mt-1">Choose a topic to begin</p>
      </header>

      <section className="px-6 space-y-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopic(topic.id)}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              topic.primary
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-card hover:shadow-md"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{topic.title}</h3>
                <p
                  className={`text-sm ${
                    topic.primary
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {topic.description}
                </p>
              </div>
              <ChevronRight
                className={`h-5 w-5 ${
                  topic.primary ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              />
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

export default Chat;