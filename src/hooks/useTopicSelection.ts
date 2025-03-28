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
    { id: "health", emoji: "❤️", label: "Health" },
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
    { id: "sorrow", emoji: "💔", label: "Sorrow" },
    { id: "trauma", emoji: "🩹", label: "Trauma" },
  ];

  const learnTopics = [
    { id: "cbt", emoji: "🧠", label: "CBT" },
    { id: "breathing", emoji: "🫁", label: "Breathing" },
    { id: "cold-shower", emoji: "🚿", label: "Cold Shower" },
    { id: "brain", emoji: "🎯", label: "Brain Training" },
    { id: "meditation", emoji: "🧘", label: "Meditation" },
    { id: "nutrition", emoji: "🥗", label: "Nutrition" },
    { id: "sleep-hygiene", emoji: "🌙", label: "Sleep Hygiene" },
    { id: "exercise", emoji: "💪", label: "Exercise" },
    { id: "mindfulness", emoji: "🎐", label: "Mindfulness" },
  ];

  return {
    selectedTopic,
    setSelectedTopic,
    improvements,
    temptations,
    learnTopics,
  };
};