
export interface User {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Message {
  message: string;
  created_at: string;
  read: boolean;
  sender_id: string;
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
