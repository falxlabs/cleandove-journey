import { useChatCreation } from "./chat/useChatCreation";
import { useMessageManagement } from "./chat/useMessageManagement";
import { useChatUpdate } from "./chat/useChatUpdate";

export const useChatHistory = () => {
  const { chatId, setChatId, createChatHistory } = useChatCreation();
  const { saveMessages } = useMessageManagement();
  const { updateExistingChat } = useChatUpdate();

  return {
    chatId,
    setChatId,
    createChatHistory,
    saveMessages,
    updateExistingChat,
  };
};