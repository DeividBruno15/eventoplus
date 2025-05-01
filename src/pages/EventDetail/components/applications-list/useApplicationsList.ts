
import { useState, useEffect } from 'react';
import { EventApplication, EventStatus } from '@/types/events';

export const useApplicationsList = (initialApplications: EventApplication[]) => {
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [localApplications, setLocalApplications] = useState<EventApplication[]>(initialApplications);
  
  // Update local applications whenever the props change
  useEffect(() => {
    console.log('Applications list updated from props:', initialApplications);
    setLocalApplications(initialApplications);
  }, [initialApplications]);
  
  const handleApprove = async (
    applicationId: string, 
    providerId: string,
    onApprove: (applicationId: string, providerId: string) => Promise<void>
  ) => {
    try {
      console.log(`Approving application ${applicationId} for provider ${providerId}`);
      setProcessingIds(prev => [...prev, applicationId]);
      await onApprove(applicationId, providerId);
      
      // Update local state to show application as approved
      setLocalApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: 'accepted' } : app
        )
      );
      console.log(`Application ${applicationId} approved successfully`);
    } catch (error) {
      console.error(`Error approving application ${applicationId}:`, error);
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
      console.log(`Rejecting application ${applicationId} for provider ${providerId}`);
      setProcessingIds(prev => [...prev, applicationId]);
      await onReject(applicationId, providerId);
      
      // Update local state to show application as rejected and ensure it stays that way
      console.log(`Updating local application ${applicationId} state to rejected`);
      setLocalApplications(prev => {
        const updated = prev.map(app => 
          app.id === applicationId ? { ...app, status: 'rejected' } : app
        );
        console.log('Updated local applications:', updated);
        return updated;
      });
      console.log(`Application ${applicationId} rejected successfully and local state updated`);
    } catch (error) {
      console.error(`Error rejecting application ${applicationId}:`, error);
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
