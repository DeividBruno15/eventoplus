
import { useState, useEffect, useCallback } from 'react';
import { Event, EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { useEventData } from './useEventData';
import { useEventUserRole } from './useEventUserRole';
import { useUserApplication } from './user-application';
import { useEventApplicationsList } from './applications-list';

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

  // Debug logging
  useEffect(() => {
    if (userApplication) {
      console.log('Current user application status:', userApplication.status);
    }
  }, [userApplication]);

  return {
    event,
    applications,
    userRole,
    loading,
    userHasApplied,
    userApplication,
    refetchEvent,
    updateApplicationStatus
  };
};
