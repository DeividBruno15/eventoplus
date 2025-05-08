
export interface User {
  id: string;
  first_name?: string;
  last_name?: string | null;
  user_metadata?: {
    first_name: string;
    last_name?: string | null;
  };
}

export interface Message {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
  sender_id: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string | null;
  avatar_url?: string;
}

export interface ConversationDetails {
  updated_at: string;
  other_user_id: string;
  other_user_first_name: string;
  other_user_last_name: string;
  last_message: string | null;
  last_message_time: string | null;
  is_read: boolean | null;
  is_sender: string | null;
}

export interface Conversation {
  id: string;
  updated_at: string;
  otherUser: User;
  lastMessage: {
    message: string;
    created_at: string;
    is_read: boolean;
    is_mine: boolean;
  } | null;
}
