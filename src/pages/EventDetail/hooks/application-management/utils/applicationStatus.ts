
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Updates the status of an application
 * @param applicationId ID of the application
 * @param status New status ('accepted' or 'rejected')
 * @returns The updated application data
 * @throws Error if the update fails
 */
export const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
  try {
    // Update the application status in the database
    const { data, error } = await supabase
      .from('event_applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .maybeSingle();

    if (error) {
      console.error(`Error updating application to ${status}:`, error);
      throw error;
    }
    
    // If no data was returned but no error occurred, construct a minimal response
    if (!data) {
      return {
        id: applicationId,
        status
      };
    }
    
    // Return the updated application data
    return data;
  } catch (error: any) {
    console.error('Error in updateApplicationStatus:', error);
    throw error;
  }
}
