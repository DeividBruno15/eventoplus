import { useState, useEffect, useCallback } from 'react';
import { Event, EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { useEventData } from './useEventData';
import { useEventUserRole } from './useEventUserRole';
import { useUserApplication } from './user-application';
import { useEventApplicationsList } from './applications-list';
import { useRejectionState } from './useEventStateBackup';

interface EventDetailsProps {
  id?: string;
  user?: User | null;
}

interface EventDetailsState {
  event: Event | null;
  applications: EventApplication[];
  userRole: 'provider' | 'contractor' | null;
  loading: boolean;
  userHasApplied: boolean;
  userApplication: EventApplication | null;
  refetchEvent: () => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

/**
 * Main hook that combines all event-related functionality
 */
export const useEventDetails = ({ id, user: passedUser }: EventDetailsProps): EventDetailsState => {
  const { user: authUser } = useAuth();
  const user = passedUser || authUser;
  
  // Use the split hooks
  const { event, loading, refetchEvent } = useEventData(id);
  const { userRole } = useEventUserRole(user);
  const { userHasApplied, userApplication } = useUserApplication(id, user);
  const { applications, updateApplicationStatus } = useEventApplicationsList(id, user, userRole);
  
  // Filtrar candidaturas rejeitadas usando a lista persistente
  const { filterRejectedApplications } = useRejectionState(id);
  const filteredApplications = filterRejectedApplications(applications);

  // Debug logging
  useEffect(() => {
    if (userApplication) {
      console.log('Current user application status:', userApplication.status);
    }
    
    console.log(`Applications before filtering: ${applications.length}, after: ${filteredApplications.length}`);
  }, [userApplication, applications, filteredApplications]);

  return {
    event,
    applications: filteredApplications,
    userRole,
    loading,
    userHasApplied,
    userApplication,
    refetchEvent,
    updateApplicationStatus
  };
};
