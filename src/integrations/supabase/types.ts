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
      chat_messages: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          service_request_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_request_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          service_request_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_applications: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          message: string
          provider_id: string
          rejection_reason: string | null
          service_category: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          message: string
          provider_id: string
          rejection_reason?: string | null
          service_category?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          message?: string
          provider_id?: string
          rejection_reason?: string | null
          service_category?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rejection_log: {
        Row: {
          application_id: string
          applied_to_main_table: boolean | null
          event_id: string
          id: string
          provider_id: string
          reason: string | null
          rejected_by: string | null
          rejection_date: string | null
        }
        Insert: {
          application_id: string
          applied_to_main_table?: boolean | null
          event_id: string
          id?: string
          provider_id: string
          reason?: string | null
          rejected_by?: string | null
          rejection_date?: string | null
        }
        Update: {
          application_id?: string
          applied_to_main_table?: boolean | null
          event_id?: string
          id?: string
          provider_id?: string
          reason?: string | null
          rejected_by?: string | null
          rejection_date?: string | null
        }
        Relationships: []
      }
      event_rejections: {
        Row: {
          application_data: Json | null
          application_id: string
          event_id: string
          id: string
          provider_id: string
          reason: string | null
          rejected_by: string | null
          rejection_date: string | null
        }
        Insert: {
          application_data?: Json | null
          application_id: string
          event_id: string
          id?: string
          provider_id: string
          reason?: string | null
          rejected_by?: string | null
          rejection_date?: string | null
        }
        Update: {
          application_data?: Json | null
          application_id?: string
          event_id?: string
          id?: string
          provider_id?: string
          reason?: string | null
          rejected_by?: string | null
          rejection_date?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          contractor_id: string
          created_at: string | null
          description: string
          event_date: string
          event_time: string | null
          id: string
          image_url: string | null
          location: string
          max_attendees: number | null
          name: string
          service_requests: Json | null
          service_type: string
          status: string
          user_id: string
          zipcode: string | null
        }
        Insert: {
          contractor_id: string
          created_at?: string | null
          description: string
          event_date: string
          event_time?: string | null
          id?: string
          image_url?: string | null
          location: string
          max_attendees?: number | null
          name: string
          service_requests?: Json | null
          service_type: string
          status?: string
          user_id: string
          zipcode?: string | null
        }
        Update: {
          contractor_id?: string
          created_at?: string | null
          description?: string
          event_date?: string
          event_time?: string | null
          id?: string
          image_url?: string | null
          location?: string
          max_attendees?: number | null
          name?: string
          service_requests?: Json | null
          service_type?: string
          status?: string
          user_id?: string
          zipcode?: string | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          created_at: string | null
          details: Json | null
          id: number
          message: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: number
          message: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: number
          message?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          link: string | null
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          status: string | null
          stripe_payment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          status?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          status?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      provider_services: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          portfolio_links: Json | null
          provider_id: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          portfolio_links?: Json | null
          provider_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          portfolio_links?: Json | null
          provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_services_edits: {
        Row: {
          edit_date: string | null
          id: string
          next_allowed_edit_date: string | null
          provider_id: string
        }
        Insert: {
          edit_date?: string | null
          id?: string
          next_allowed_edit_date?: string | null
          provider_id: string
        }
        Update: {
          edit_date?: string | null
          id?: string
          next_allowed_edit_date?: string | null
          provider_id?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          attendees: number | null
          city: string
          contractor_id: string
          created_at: string | null
          description: string | null
          event_date: string
          event_type: string
          id: string
          provider_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          attendees?: number | null
          city: string
          contractor_id: string
          created_at?: string | null
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          provider_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          attendees?: number | null
          city?: string
          contractor_id?: string
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          provider_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          plan_id: string
          plan_name: string
          role: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          plan_id: string
          plan_name: string
          role: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          plan_id?: string
          plan_name?: string
          role?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_companies: {
        Row: {
          city: string
          created_at: string
          id: string
          name: string
          neighborhood: string
          number: string
          state: string
          street: string
          user_id: string
          zipcode: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          name: string
          neighborhood: string
          number: string
          state: string
          street: string
          user_id: string
          zipcode: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          name?: string
          neighborhood?: string
          number?: string
          state?: string
          street?: string
          user_id?: string
          zipcode?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string
          created_at: string | null
          document_number: string
          first_name: string
          id: string
          is_onboarding_complete: boolean | null
          last_name: string | null
          latitude: number | null
          longitude: number | null
          neighborhood: string | null
          number: string | null
          person_type: string
          phone_number: string | null
          role: string
          state: string
          street: string | null
          updated_at: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city: string
          created_at?: string | null
          document_number: string
          first_name: string
          id: string
          is_onboarding_complete?: boolean | null
          last_name?: string | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          number?: string | null
          person_type: string
          phone_number?: string | null
          role: string
          state: string
          street?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string
          created_at?: string | null
          document_number?: string
          first_name?: string
          id?: string
          is_onboarding_complete?: boolean | null
          last_name?: string | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          number?: string | null
          person_type?: string
          phone_number?: string | null
          role?: string
          state?: string
          street?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      user_venues: {
        Row: {
          city: string
          created_at: string
          id: string
          name: string
          neighborhood: string
          number: string
          state: string
          street: string
          user_id: string
          zipcode: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          name: string
          neighborhood: string
          number: string
          state: string
          street: string
          user_id: string
          zipcode: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          name?: string
          neighborhood?: string
          number?: string
          state?: string
          street?: string
          user_id?: string
          zipcode?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_provider_services: {
        Args: { provider_id_param: string }
        Returns: boolean
      }
      create_or_get_conversation: {
        Args: { user_id_one: string; user_id_two: string }
        Returns: string
      }
      delete_application: {
        Args: { app_id: string }
        Returns: boolean
      }
      ensure_rejection_log_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      force_delete_application: {
        Args: { app_id: string }
        Returns: boolean
      }
      force_update_application_status: {
        Args: { app_id: string; new_status: string; reason_text: string }
        Returns: boolean
      }
      get_conversation_details: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: {
          updated_at: string
          other_user_id: string
          other_user_first_name: string
          other_user_last_name: string
          last_message: string
          last_message_time: string
          is_read: boolean
          is_sender: string
        }[]
      }
      get_user_conversations: {
        Args: { p_user_id: string }
        Returns: {
          conversation_id: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      reject_application: {
        Args: { application_id: string; rejection_text: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
