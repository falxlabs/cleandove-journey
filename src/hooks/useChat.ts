import { useState } from "react";
import { Message } from "@/types/chat";
import { useMessages } from "./useMessages";
import { useMessageOperations } from "./useMessageOperations";
import { useChatInitialization } from "./useChatInitialization";
import { useChatTitle } from "./useChatTitle";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UseChatProps {
  initialTopic?: string;
  context?: string;
  improvement?: string;
  chatId?: string;
  isExistingChat?: boolean;
}

export const useChat = ({ 
  initialTopic, 
  context, 
  improvement,
  chatId,
  isExistingChat 
}: UseChatProps = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isInitialLoading, initializeChat, getSystemMessage } = useMessages({
    initialTopic,
    context,
    improvement,
    chatId,
    isExistingChat,
    setMessages
  });

  const {
    input,
    setInput,
    isLoading,
    sendMessage,
    regenerateMessage
  } = useMessageOperations(chatId);

  const {
    showCreditAlert,
    setShowCreditAlert,
    handleNewMessage
  } = useChatInitialization(messages, chatId);

  const { chatTitle } = useChatTitle(initialTopic);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = input;
    setInput("");

    try {
      let currentChatId = chatId;
      let messageSequence = messages.length + 1;

      if (!currentChatId) {
        // Create new chat and save initial message if this is a new chat
        currentChatId = await handleNewMessage(currentInput, "", messages);
        
        if (initialTopic === 'reflect' && !isExistingChat && currentChatId) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const today = format(new Date(), 'yyyy-MM-dd');
            await supabase
              .from('daily_tasks')
              .upsert({
                user_id: session.user.id,
                task_type: 'reflect',
                completed_at: new Date().toISOString(),
                date: today,
                chat_id: currentChatId
              });
          }
        }
      }

      // Get assistant's response
      const content = await sendMessage([...messages, newMessage]);
      
      if (content && currentChatId) {
        const messageParts = content.split("[NEXT]").map(part => part.trim()).filter(Boolean);
        
        // Save all messages in one batch with correct sequence numbers
        const messagesToSave = [];
        
        // Add user message
        messagesToSave.push({
          chat_id: currentChatId,
          content: currentInput,
          sender: "user",
          sequence_number: messageSequence++
        });

        // Add assistant response parts
        for (const part of messageParts) {
          const assistantResponse: Message = {
            id: Date.now().toString(),
            content: part,
            sender: "assistant",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantResponse]);

          messagesToSave.push({
            chat_id: currentChatId,
            content: part,
            sender: "assistant",
            sequence_number: messageSequence++
          });
        }

        // Save all messages in one batch
        const { error: messagesError } = await supabase
          .from("messages")
          .insert(messagesToSave);

        if (messagesError) {
          console.error("Error saving messages:", messagesError);
          throw messagesError;
        }

        // Update chat preview with the last assistant message
        if (messagesToSave.length > 0) {
          const lastMessage = messagesToSave[messagesToSave.length - 1];
          await supabase
            .from("chat_histories")
            .update({
              preview: lastMessage.content,
              reply_count: messageSequence - 1
            })
            .eq("id", currentChatId);
        }
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }
  };

  return {
    input,
    setInput,
    isLoading,
    isInitialLoading,
    messages,
    showCreditAlert,
    setShowCreditAlert,
    sendMessage: handleSendMessage,
    initializeChat,
    regenerateMessage,
    chatTitle
  };
};