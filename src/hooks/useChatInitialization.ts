import { useState } from "react";
import { Message } from "@/types/chat";
import { useChatHistory } from "./useChatHistory";
import { useChatTitle } from "./useChatTitle";

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
      const newChatId = await createChatHistory(userInput, content);
      if (newChatId) {
        // Only save the actual conversation messages, not the initial greeting
        const conversationMessages = currentMessages.filter(msg => 
          msg.sender === "user" || 
          (msg.sender === "assistant" && messages.indexOf(msg) > 0)
        );
        await saveMessages(newChatId, conversationMessages, userInput, content);
        await generateTitle([...conversationMessages, assistantResponse], newChatId);
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