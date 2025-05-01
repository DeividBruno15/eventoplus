
import { useState } from 'react';
import { Event } from '@/types/events';
import { useApplicationApproval } from '../useApplicationApproval';

/**
 * Hook that provides functionality for approving applications
 */
export const useApplicationApprovalHandler = (
  event: Event | null, 
  updateCallback?: (applicationId: string, status: 'accepted' | 'rejected') => void
) => {
  const { 
    isApproving, 
    handleApproveApplication 
  } = useApplicationApproval(event, (applicationId: string) => {
    // Ensure we're only passing the applicationId to match the expected signature
    // and the status 'accepted' is hardcoded for approval
    if (updateCallback) updateCallback(applicationId, 'accepted');
  });

  return {
    isApproving,
    handleApproveApplication
  };
};
