export interface Chat {
  id: string;
  title: string;
  preview: string;
  date: string;
  replies: number;
  favorite: boolean;
}

export interface ChatListProps {
  chats: Chat[];
  isLoading?: boolean;
}