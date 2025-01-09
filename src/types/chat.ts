export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export interface ChatConversation {
  messages: Message[];
  isLoading: boolean;
  isInitialLoading: boolean;
}