
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
    refetchEvent,
    updateApplicationStatus
  } = useEventDetails({ id, user });
  
  const { 
    submitting, 
    handleApply, 
    handleApproveApplication,
    handleCancelApplication,
    handleRejectApplication
  } = useEventApplications(event, updateApplicationStatus);
  
  console.log("Applications in useEventState:", applications);
  
  // Para debugging - monitorar alterações na aplicação do usuário
  useEffect(() => {
    if (userApplication) {
      console.log("User application status in useEventState:", userApplication.status);
    }
  }, [userApplication]);

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
