
import { Event } from '@/types/events';
import { 
  useApplicationApprovalHandler,
  useApplicationRejectionHandler,
  useSubmittingState
} from './hooks';

/**
 * Main hook that combines application approval and rejection functionality
 */
export const useApplicationManagement = (
  event: Event | null, 
  updateApplicationStatus?: (applicationId: string, status: 'accepted' | 'rejected') => void
) => {
  // Use the split hooks for approval and rejection
  const { 
    approving, 
    handleApproveApplication 
  } = useApplicationApprovalHandler(event, updateApplicationStatus);
    
  const { 
    rejecting, 
    handleRejectApplication 
  } = useApplicationRejectionHandler(event, updateApplicationStatus);
  
  // Combine into a single submitting state for the UI
  const submitting = useSubmittingState([approving, rejecting]);

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
