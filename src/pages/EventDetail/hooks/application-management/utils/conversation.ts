
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates or gets a conversation between two users
 * @param contractorId ID of the contractor
 * @param providerId ID of the provider
 * @returns The conversation ID
 */
export const createOrGetConversation = async (contractorId: string, providerId: string): Promise<string> => {
  try {
    const { data: conversationData, error: conversationError } = await supabase.rpc(
      // We need to use 'as any' here because TypeScript doesn't know about this function
      'create_or_get_conversation' as any, 
      { 
        user_id_one: contractorId,
        user_id_two: providerId
      }
    );

    if (conversationError) {
      console.error('Error creating conversation:', conversationError);
      throw conversationError;
    }

    // The conversation ID is directly returned as a UUID from our function
    return conversationData;
  } catch (error) {
    console.error('Error in createOrGetConversation:', error);
    throw error;
  }
};
