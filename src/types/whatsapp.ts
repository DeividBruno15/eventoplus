
export interface WhatsAppMessage {
  id: string;
  message: string;
  direction: 'inbound' | 'outbound';
  created_at: string;
  read: boolean;
  is_auto_reply?: boolean;
  sending?: boolean;
  twilio_message_id?: string;
  user_id: string;
}
