export interface Message {
  id: string;
  content: string;
  sender: "assistant" | "user";
  timestamp: Date;
}