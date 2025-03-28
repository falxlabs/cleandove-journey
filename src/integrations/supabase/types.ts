export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_histories: {
        Row: {
          created_at: string
          favorite: boolean
          id: string
          preview: string | null
          reply_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite?: boolean
          id?: string
          preview?: string | null
          reply_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          favorite?: boolean
          id?: string
          preview?: string | null
          reply_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_tasks: {
        Row: {
          created_at: string
          id: string
          task_type: string
          time: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          task_type: string
          time?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          task_type?: string
          time?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          chat_id: string | null
          completed_at: string | null
          created_at: string
          date: string
          id: string
          task_type: string
          user_id: string
        }
        Insert: {
          chat_id?: string | null
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          task_type: string
          user_id: string
        }
        Update: {
          chat_id?: string | null
          completed_at?: string | null
          created_at?: string
          date?: string
          id?: string
          task_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_tasks_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat_histories"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          is_initial_message: boolean | null
          sender: string
          sequence_number: number
          updated_at: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          is_initial_message?: boolean | null
          sender: string
          sequence_number: number
          updated_at?: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          is_initial_message?: boolean | null
          sender?: string
          sequence_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat_histories"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_configurations: {
        Row: {
          created_at: string
          daily_credits: number
          description: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          daily_credits: number
          description?: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          daily_credits?: number
          description?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          pearls: number
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          pearls?: number
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          pearls?: number
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      recurring_tasks: {
        Row: {
          created_at: string
          end_date: string | null
          frequency: string
          id: string
          interval: number
          monthly_day_of_week: string | null
          monthly_pattern: string | null
          monthly_week_of_month: string | null
          start_date: string
          task_type: string
          user_id: string
          weekdays: string[] | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          frequency: string
          id?: string
          interval?: number
          monthly_day_of_week?: string | null
          monthly_pattern?: string | null
          monthly_week_of_month?: string | null
          start_date: string
          task_type: string
          user_id: string
          weekdays?: string[] | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          frequency?: string
          id?: string
          interval?: number
          monthly_day_of_week?: string | null
          monthly_pattern?: string | null
          monthly_week_of_month?: string | null
          start_date?: string
          task_type?: string
          user_id?: string
          weekdays?: string[] | null
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          credits: number
          id: string
          last_credit_reset: string | null
          plan: Database["public"]["Enums"]["subscription_plan"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          credits?: number
          id?: string
          last_credit_reset?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          last_credit_reset?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          reading_type: string
          religious_content: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          reading_type?: string
          religious_content?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          reading_type?: string
          religious_content?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          last_completed_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          last_completed_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          last_completed_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: number
      }
      decrement_credits: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      set_user_plan: {
        Args: {
          target_user_id: string
          new_plan: Database["public"]["Enums"]["subscription_plan"]
        }
        Returns: undefined
      }
    }
    Enums: {
      subscription_plan: "free" | "premium" | "dev"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
