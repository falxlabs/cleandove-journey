interface StreakTabsProps {
  activeTab: "personal" | "friends";
  setActiveTab: (tab: "personal" | "friends") => void;
}

export const StreakTabs = ({ activeTab, setActiveTab }: StreakTabsProps) => {
  return (
    <div className="flex mb-8 border-b">
      <button
        className={`flex-1 pb-2 text-lg font-medium ${
          activeTab === "personal"
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground"
        }`}
        onClick={() => setActiveTab("personal")}
      >
        PERSONAL
      </button>
      <button
        className={`flex-1 pb-2 text-lg font-medium ${
          activeTab === "friends"
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground"
        }`}
        onClick={() => setActiveTab("friends")}
      >
        FRIENDS
      </button>
    </div>
  );
};