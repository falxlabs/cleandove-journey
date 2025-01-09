export interface Topic {
  id: string;
  emoji: string;
  label: string;
}

export interface Chat {
  id: string;
  title: string;
  preview?: string;
  created_at: string;
  updated_at: string;
  replies: number;
  favorite: boolean;
  user_id: string;
}