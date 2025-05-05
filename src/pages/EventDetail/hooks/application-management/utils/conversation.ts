
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates or retrieves a conversation between two users
 */
export const createOrGetConversation = async (userIdOne: string, userIdTwo: string): Promise<string | null> => {
  try {
    // Use the RPC function to create or get a conversation
    const { data, error } = await supabase.rpc('create_or_get_conversation', {
      user_id_one: userIdOne,
      user_id_two: userIdTwo
    });
    
    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createOrGetConversation:', error);
    return null;
  }
};
