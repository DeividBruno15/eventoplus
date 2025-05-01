
import { useState } from 'react';
import { Event } from '@/types/events';
import { useApplicationApproval } from './useApplicationApproval';
import { useApplicationRejection } from './useApplicationRejection';

export const useApplicationManagement = (event: Event | null, updateApplicationStatus?: (applicationId: string, status: 'accepted' | 'rejected') => void) => {
  const { 
    isApproving, 
    handleApproveApplication 
  } = useApplicationApproval(event, (applicationId: string) => {
    // Ensure we're only passing the applicationId to match the expected signature
    // and the status 'accepted' is hardcoded for approval
    if (updateApplicationStatus) updateApplicationStatus(applicationId, 'accepted');
  });
    
  const { 
    rejecting, 
    handleRejectApplication 
  } = useApplicationRejection(event, (applicationId: string) => {
    // Ensure we're only passing the applicationId to match the expected signature
    // and the status 'rejected' is hardcoded for rejection
    if (updateApplicationStatus) updateApplicationStatus(applicationId, 'rejected');
  });
  
  // Combine into a single submitting state for the UI
  const submitting = isApproving || rejecting;

  return {
    submitting, 
    handleApproveApplication,
    handleRejectApplication
  };
};

// Export all hooks and utilities
export * from './useApplicationApproval';
export * from './useApplicationRejection';
export * from './utils/conversation';
export * from './utils/applicationStatus';
