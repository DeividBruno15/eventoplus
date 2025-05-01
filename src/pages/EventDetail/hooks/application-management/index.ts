
import { useState } from 'react';
import { Event } from '@/types/events';
import { useApplicationApproval } from './useApplicationApproval';
import { useApplicationRejection } from './useApplicationRejection';

export const useApplicationManagement = (event: Event | null, updateApplicationStatus?: (applicationId: string, status: 'accepted' | 'rejected') => void) => {
  const { 
    isApproving, 
    handleApproveApplication 
  } = useApplicationApproval(event, updateApplicationStatus);
    
  const { 
    rejecting, 
    handleRejectApplication 
  } = useApplicationRejection(event, updateApplicationStatus);
  
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
