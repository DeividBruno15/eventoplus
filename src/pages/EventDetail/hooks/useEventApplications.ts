
import { useState } from 'react';
import { Event } from '@/types/events';
import { useApplicationManagement } from './application-management';
import { useProviderApplications } from './useProviderApplications';

export const useEventApplications = (event: Event | null, updateApplicationStatus?: (applicationId: string, status: 'accepted' | 'rejected') => void) => {
  const [submitting, setSubmitting] = useState(false);
  
  // Import functionality from separate hooks
  const { 
    handleApproveApplication, 
    handleRejectApplication 
  } = useApplicationManagement(event, updateApplicationStatus);
  
  const { 
    handleApply, 
    handleCancelApplication 
  } = useProviderApplications(event);

  return {
    submitting,
    handleApply,
    handleApproveApplication,
    handleRejectApplication,
    handleCancelApplication
  };
};
