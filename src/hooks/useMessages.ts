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

    const improvementTopic = improvements.find(item => item.id === topic);
    if (improvementTopic) {
      return { category: "improvement", label: improvementTopic.label };
    }

    const temptationTopic = temptations.find(item => item.id === topic);
    if (temptationTopic) {
      return { category: "temptation", label: temptationTopic.label };
    }

    const learnTopic = learnTopics.find(item => item.id === topic);
    if (learnTopic) {
      return { category: "learn", label: learnTopic.label };
    }

    return null;
  };

  const getSystemMessage = (topic: string): string => {
    const topicContext = getTopicContext(topic);
    if (!topicContext) return "";

    switch (topicContext.category) {
      case "improvement":
        return `You are a supportive AI assistant focused on helping users improve their ${topicContext.label.toLowerCase()}. Provide practical advice, encouragement, and actionable steps while maintaining a positive and motivating tone.`;
      case "temptation":
        return `You are a compassionate AI assistant helping users overcome challenges with ${topicContext.label.toLowerCase()}. Offer understanding, practical coping strategies, and positive reinforcement while maintaining a non-judgmental and supportive tone.`;
      case "learn":
        return `You are a knowledgeable AI assistant explaining ${topicContext.label} techniques and practices. Focus on evidence-based information, practical implementation, and scientific understanding while maintaining an educational and accessible tone.`;
      default:
        return "";
    }
  };

  const getInitialMessage = async (): Promise<Message> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();

      const username = profile?.username || 'there';

      if (context && improvement) {
        const topicContext = getTopicContext(initialTopic || '');
        if (topicContext) {
          const messages = {
            improvement: `Hi ${username}! I'd love to help you improve your ${improvement.toLowerCase()}. What specific area would you like to focus on developing?`,
            temptation: `Hi ${username}! I understand you're facing challenges with ${improvement.toLowerCase()}. You're not alone, and I'm here to support you. What would you like to discuss?`,
            learn: `Hi ${username}! I'd be happy to help you learn about ${improvement.toLowerCase()}. What specific aspects would you like to understand better?`
          };
          return {
            id: "1",
            content: messages[topicContext.category as keyof typeof messages] || messages.improvement,
            sender: "assistant",
            timestamp: new Date(),
          };
        }
      }

      if (initialTopic) {
        const topicContext = getTopicContext(initialTopic);
        if (topicContext) {
          const messages = {
            improvement: `Hi ${username}! I'd love to help you improve your ${topicContext.label.toLowerCase()}. What specific area would you like to focus on developing?`,
            temptation: `Hi ${username}! I understand you're facing challenges with ${topicContext.label.toLowerCase()}. You're not alone, and I'm here to support you. What would you like to discuss?`,
            learn: `Hi ${username}! I'd be happy to help you learn about ${topicContext.label}. What specific aspects would you like to understand better?`
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
        content: `Hi ${username}! What's on your mind today?`,
        sender: "assistant",
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error fetching username:', error);
      return {
        id: "1",
        content: "Hi there! What's on your mind today?",
        sender: "assistant",
        timestamp: new Date(),
      };
    }
  };

  const updateReplyCount = async (chatId: string, messages: Message[]) => {
    const firstUserMessageIndex = messages.findIndex(msg => msg.sender === 'user');
    if (firstUserMessageIndex === -1) return;

    const assistantMessagesAfterUser = messages
      .slice(firstUserMessageIndex + 1)
      .filter(msg => msg.sender === 'assistant')
      .length;

    await supabase
      .from('chat_histories')
      .update({ reply_count: assistantMessagesAfterUser })
      .eq('id', chatId);
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
        
        // Update reply count after loading messages
        await updateReplyCount(chatId, formattedMessages);
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
        const initialMessage = await getInitialMessage();
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
