
import { useState } from 'react';
import { Event } from '@/types/events';
import { useApplicationApproval } from './useApplicationApproval';
import { useApplicationRejection } from './useApplicationRejection';

export const useApplicationManagement = (event: Event | null) => {
  const { approving, handleApproveApplication } = useApplicationApproval(event);
  const { rejecting, handleRejectApplication } = useApplicationRejection(event);
  
  // Combine into a single submitting state for the UI
  const submitting = approving || rejecting;

  return {
    submitting, 
    handleApproveApplication,
    handleRejectApplication
  };
};
