export interface Message {
  id: string;
  content: string;
  sender: "assistant" | "user";
  timestamp: Date;
  isInitialMessage?: boolean;
}

export interface ChatMessage extends Message {
  isLoading?: boolean;
  error?: string;
}

export interface ChatHistoryEntry {
  id: string;
  title: string;
  preview: string;
  date: string;
  replies: number;
  favorite: boolean;
}