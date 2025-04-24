
export interface User {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Message {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
  sender_id: string;
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
