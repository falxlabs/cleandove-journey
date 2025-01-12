import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

interface UseMessagesProps {
  initialTopic?: string;
  context?: string;
  improvement?: string;
  chatId?: string;
  isExistingChat?: boolean;
  setMessages: (messages: Message[]) => void;
}

export const useMessages = ({ 
  initialTopic,
  context,
  improvement,
  chatId,
  isExistingChat,
  setMessages 
}: UseMessagesProps) => {
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const getTopicContext = (topic: string): { category: string; label: string } | null => {
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

    const therapyTopics = [
      { id: "cbt", emoji: "🧠", label: "CBT" },
      { id: "breathing", emoji: "🫁", label: "Breathing" },
      { id: "habits", emoji: "📝", label: "Habits" },
      { id: "cold-shower", emoji: "🚿", label: "Cold Shower" },
      { id: "brain", emoji: "🎯", label: "Brain Training" },
      { id: "meditation", emoji: "🧘", label: "Meditation" },
      { id: "nutrition", emoji: "🥗", label: "Nutrition" },
      { id: "sleep-hygiene", emoji: "🌙", label: "Sleep Hygiene" },
      { id: "exercise", emoji: "💪", label: "Exercise" },
      { id: "mindfulness", emoji: "🎐", label: "Mindfulness" },
    ];

    const improvementTopic = improvements.find(item => item.id === topic);
    if (improvementTopic) {
      return { category: "improvement", label: improvementTopic.label };
    }

    const temptationTopic = temptations.find(item => item.id === topic);
    if (temptationTopic) {
      return { category: "temptation", label: temptationTopic.label };
    }

    const therapyTopic = therapyTopics.find(item => item.id === topic);
    if (therapyTopic) {
      return { category: "therapy", label: therapyTopic.label };
    }

    return null;
  };

  const getSystemMessage = (topic: string): string => {
    const topicContext = getTopicContext(topic);
    if (!topicContext) return "";

    switch (topicContext.category) {
      case "improvement":
        return `You are a supportive AI assistant focused on helping users improve their ${topicContext.label.toLowerCase()}. Provide practical advice, encouragement, and actionable steps.`;
      case "temptation":
        return `You are a compassionate AI assistant helping users overcome challenges with ${topicContext.label.toLowerCase()}. Offer understanding, coping strategies, and positive reinforcement.`;
      case "therapy":
        return `You are a knowledgeable AI assistant explaining ${topicContext.label} techniques and practices. Focus on evidence-based information and practical implementation.`;
      default:
        return "";
    }
  };

  const getInitialMessage = (): Message => {
    if (context && improvement) {
      return {
        id: "1",
        content: `I understand you want to work on your ${improvement.toLowerCase()}. I'm here to help you with that. What specific aspects of ${improvement.toLowerCase()} would you like to focus on?`,
        sender: "assistant",
        timestamp: new Date(),
      };
    }

    if (initialTopic) {
      const topicContext = getTopicContext(initialTopic);
      if (topicContext) {
        const messages = {
          improvement: `I see you want to improve your ${topicContext.label.toLowerCase()}. What specific aspects would you like to work on?`,
          temptation: `I understand you're struggling with ${topicContext.label.toLowerCase()}. I'm here to help you overcome this challenge. Would you like to share more about your experience?`,
          therapy: `I can help you learn more about ${topicContext.label}. What specific aspects would you like to understand better?`
        };

        return {
          id: "1",
          content: messages[topicContext.category as keyof typeof messages],
          sender: "assistant",
          timestamp: new Date(),
        };
      }
    }

    return {
      id: "1",
      content: "Hello! I'm Pace, your personal accountability partner. I'm here to help you stay on track with your goals and build better habits. How can I assist you today?",
      sender: "assistant",
      timestamp: new Date(),
    };
  };

  const loadExistingMessages = async () => {
    if (!chatId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No active session');
        return;
      }

      setIsInitialLoading(true);
      const { data: existingMessages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('sequence_number', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      if (existingMessages) {
        const formattedMessages: Message[] = existingMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as "assistant" | "user",
          timestamp: new Date(msg.created_at)
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error in loadExistingMessages:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const initializeChat = async () => {
    try {
      if (isExistingChat) {
        await loadExistingMessages();
      } else {
        const initialMessage = getInitialMessage();
        setMessages([initialMessage]);
      }
    } catch (error) {
      console.error('Error in initializeChat:', error);
    }
  };

  useEffect(() => {
    initializeChat();
  }, [chatId, isExistingChat]);

  return {
    isInitialLoading,
    initializeChat,
    getSystemMessage: initialTopic ? () => getSystemMessage(initialTopic) : undefined,
  };
};