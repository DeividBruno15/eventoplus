
import { useState } from 'react';
import { Event } from '@/types/events';
import { useApplicationRejection } from '../useApplicationRejection';

/**
 * Hook that provides functionality for rejecting applications
 */
export const useApplicationRejectionHandler = (
  event: Event | null, 
  updateCallback?: (applicationId: string, status: 'accepted' | 'rejected') => void
) => {
  const { 
    rejecting, 
    handleRejectApplication 
  } = useApplicationRejection(event, (applicationId: string) => {
    // Ensure we're only passing the applicationId to match the expected signature
    // and the status 'rejected' is hardcoded for rejection
    if (updateCallback) updateCallback(applicationId, 'rejected');
  });

  return {
    rejecting,
    handleRejectApplication
  };
};
