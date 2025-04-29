
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEventDetails } from './useEventDetails';
import { useEventApplications } from './useEventApplications';
import { useAuth } from '@/hooks/useAuth';

export const useEventState = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const { 
    event, 
    applications, 
    userRole, 
    loading, 
    userHasApplied, 
    userApplication,
    refetchEvent 
  } = useEventDetails({ id, user });
  
  const { 
    submitting, 
    handleApply, 
    handleApproveApplication,
    handleCancelApplication,
    handleRejectApplication
  } = useEventApplications(event);

  return {
    id,
    user,
    event,
    applications,
    userRole,
    loading,
    userHasApplied,
    userApplication,
    refetchEvent,
    submitting,
    handleApply,
    handleApproveApplication,
    handleCancelApplication,
    handleRejectApplication
  };
};
