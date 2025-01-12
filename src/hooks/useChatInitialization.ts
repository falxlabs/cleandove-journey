import { useState } from "react";
import { Message } from "@/types/chat";
import { useChatHistory } from "./useChatHistory";
import { useChatTitle } from "./useChatTitle";
import { supabase } from "@/integrations/supabase/client";

export const useChatInitialization = (
  messages: Message[],
  chatId?: string,
) => {
  const [showCreditAlert, setShowCreditAlert] = useState(false);
  const { createChatHistory, saveMessages, updateExistingChat } = useChatHistory();
  const { generateTitle } = useChatTitle();

  const handleNewMessage = async (
    userInput: string,
    content: string,
    currentMessages: Message[]
  ) => {
    const assistantResponse: Message = {
      id: (Date.now() + 1).toString(),
      content,
      sender: "assistant",
      timestamp: new Date(),
    };

    if (!chatId) {
      // Find the initial greeting message
      const initialMessage = currentMessages.find(msg => msg.isInitialMessage);
      const newChatId = await createChatHistory(userInput, content);
      
      if (newChatId && initialMessage) {
        // First, check if an initial message already exists for this chat
        const { data: existingInitialMessage } = await supabase
          .from("messages")
          .select("id")
          .eq("chat_id", newChatId)
          .eq("is_initial_message", true)
          .maybeSingle();

        // Only include initial message if one doesn't exist yet
        const messagesToSave = [];
        
        if (!existingInitialMessage) {
          messagesToSave.push({
            chat_id: newChatId,
            content: initialMessage.content,
            sender: "assistant",
            sequence_number: 1,
            is_initial_message: true
          });
        }

        // Always add the user message and assistant response
        messagesToSave.push(
          {
            chat_id: newChatId,
            content: userInput,
            sender: "user",
            sequence_number: existingInitialMessage ? 1 : 2
          },
          {
            chat_id: newChatId,
            content,
            sender: "assistant",
            sequence_number: existingInitialMessage ? 2 : 3
          }
        );

        const { error: messagesError } = await supabase
          .from("messages")
          .insert(messagesToSave);

        if (messagesError) {
          console.error("Error saving messages:", messagesError);
          return assistantResponse;
        }

        await generateTitle([...currentMessages, assistantResponse], newChatId);
      }
    } else {
      await updateExistingChat(chatId, userInput, content, messages.length);
    }

    return assistantResponse;
  };

  return {
    showCreditAlert,
    setShowCreditAlert,
    handleNewMessage,
  };
};