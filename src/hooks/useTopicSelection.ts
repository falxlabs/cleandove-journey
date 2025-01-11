import { useState } from "react";

export const useTopicSelection = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const improvements = [
    { id: "faith", emoji: "🙏", label: "Faith" },
    { id: "discipline", emoji: "⏰", label: "Discipline" },
    { id: "wisdom", emoji: "📚", label: "Wisdom" },
    { id: "relationships", emoji: "🫂", label: "Relationships" },
    { id: "purpose", emoji: "🎯", label: "Purpose" },
    { id: "peace", emoji: "🕯️", label: "Peace" },
    { id: "joy", emoji: "✨", label: "Joy" },
    { id: "gratitude", emoji: "🙌", label: "Gratitude" },
  ];

  const temptations = [
    { id: "lust", emoji: "👄", label: "Lust" },
    { id: "alcohol", emoji: "🍺", label: "Alcohol" },
    { id: "cigarettes", emoji: "🚬", label: "Cigarettes" },
    { id: "games", emoji: "🎮", label: "Games" },
    { id: "sugar", emoji: "🍬", label: "Sugar" },
    { id: "anger", emoji: "😡", label: "Anger" },
    { id: "anxiety", emoji: "😰", label: "Anxiety" },
    { id: "pride", emoji: "👑", label: "Pride" },
    { id: "greed", emoji: "🤑", label: "Greed" },
    { id: "laziness", emoji: "🦥", label: "Laziness" },
    { id: "sleep", emoji: "😴", label: "Sleep" },
  ];

  const therapyTopics = [
    { id: "cbt", emoji: "🧠", label: "CBT" },
    { id: "mindfulness", emoji: "🧘", label: "Mindfulness" },
    { id: "trauma", emoji: "❤️‍🩹", label: "Trauma" },
    { id: "relationships", emoji: "🫂", label: "Relationships" },
    { id: "self-esteem", emoji: "✨", label: "Self-Esteem" },
  ];

  return {
    selectedTopic,
    setSelectedTopic,
    improvements,
    temptations,
    therapyTopics,
  };
};