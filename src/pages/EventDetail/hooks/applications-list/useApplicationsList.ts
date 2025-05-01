
import { useState, useEffect, useCallback } from 'react';
import { EventApplication, EventStatus } from '@/types/events';

export const useApplicationsList = (initialApplications: EventApplication[]) => {
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [localApplications, setLocalApplications] = useState<EventApplication[]>(initialApplications);
  
  // Update local applications whenever the props change
  useEffect(() => {
    console.log('Applications list updated from props:', initialApplications);
    
    // Verificar se há diferenças entre as listas antes de atualizar
    const hasChanges = JSON.stringify(initialApplications) !== JSON.stringify(localApplications);
    
    if (hasChanges) {
      console.log('Detected changes in applications, updating local state');
      setLocalApplications(initialApplications);
    }
  }, [initialApplications]);
  
  const handleApprove = async (
    applicationId: string, 
    providerId: string,
    onApprove: (applicationId: string, providerId: string) => Promise<void>
  ) => {
    try {
      setProcessingIds(prev => [...prev, applicationId]);
      await onApprove(applicationId, providerId);
      
      // Update local state to show application as approved
      setLocalApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: 'accepted' } : app
        )
      );
      console.log(`Application ${applicationId} marked as accepted in local state`);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== applicationId));
    }
  };
  
  const handleReject = async (
    applicationId: string, 
    providerId: string,
    onReject: (applicationId: string, providerId: string) => Promise<void>
  ) => {
    try {
      setProcessingIds(prev => [...prev, applicationId]);
      await onReject(applicationId, providerId);
      
      // Update local state to show application as rejected
      setLocalApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: 'rejected' } : app
        )
      );
      console.log(`Application ${applicationId} marked as rejected in local state`);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== applicationId));
    }
  };
  
  const isButtonDisabled = (applicationId: string, submitting: boolean, eventStatus: string) => {
    return submitting || processingIds.includes(applicationId) || eventStatus === 'closed';
  };

  return {
    localApplications,
    processingIds,
    handleApprove,
    handleReject,
    isButtonDisabled
  };
};
