
import { useState } from 'react';
import { Event } from '@/types/events';
import { useApplicationManagement } from './useApplicationManagement';
import { useProviderApplications } from './useProviderApplications';

export const useEventApplications = (event: Event | null) => {
  const [submitting, setSubmitting] = useState(false);
  
  // Import functionality from separate hooks
  const { 
    handleApproveApplication, 
    handleRejectApplication 
  } = useApplicationManagement(event);
  
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
