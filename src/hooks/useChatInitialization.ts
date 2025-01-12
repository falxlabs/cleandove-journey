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
        // Save messages in correct sequence: initial -> user -> assistant
        const messagesToSave = [
          {
            chat_id: newChatId,
            content: initialMessage.content,
            sender: "assistant",
            sequence_number: 1,
            is_initial_message: true
          },
          {
            chat_id: newChatId,
            content: userInput,
            sender: "user",
            sequence_number: 2
          },
          {
            chat_id: newChatId,
            content,
            sender: "assistant",
            sequence_number: 3
          }
        ];

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