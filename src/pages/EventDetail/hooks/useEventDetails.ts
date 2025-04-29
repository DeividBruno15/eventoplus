import { useState, useEffect } from 'react';
import { Event, EventApplication } from '@/types/events';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { useEventData } from './useEventData';
import { useEventUserRole } from './useEventUserRole';
import { useUserApplication } from './useUserApplication';
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
  const { applications } = useEventApplicationsList(id, user, userRole);

  return {
    event,
    applications,
    userRole,
    loading,
    userHasApplied,
    userApplication,
    refetchEvent
  };
};
