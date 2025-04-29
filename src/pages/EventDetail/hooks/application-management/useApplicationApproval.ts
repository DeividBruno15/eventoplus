import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, ServiceRequest } from '@/types/events';
import { toast } from 'sonner';
import { sendProviderNotification } from '../useEventNotifications';
import { useNavigate } from 'react-router-dom';
import { Json } from '@/integrations/supabase/types';

export const useApplicationApproval = (event: Event | null, updateApplicationStatus?: (applicationId: string, status: 'accepted') => void) => {
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();

  /**
   * Approves an application for an event
   */
  const handleApproveApplication = async (applicationId: string, providerId: string): Promise<void> => {
    if (!event) return;
    
    try {
      setApproving(true);
      console.log('Approving application:', applicationId, 'for provider:', providerId);
      
      // Get the application to determine which service it's for
      const { data: applicationData, error: appError } = await supabase
        .from('event_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
        
      if (appError) {
        console.error('Error fetching application details:', appError);
        throw appError;
      }
      
      // Check if this application is already accepted
      if (applicationData.status === 'accepted') {
        // Check if a conversation already exists between these users
        const { data: existingConversation } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', event.contractor_id)
          .in('conversation_id', function(builder: any) {
            builder
              .select('conversation_id')
              .from('conversation_participants')
              .eq('user_id', providerId);
          })
          .single();
          
        if (existingConversation) {
          // Redirect to existing conversation
          toast.info("Redirecionando para conversa existente...");
          navigate('/chat');
          return;
        }
        // Otherwise, continue to create a new conversation
      }
      
      // Approve this application
      const { error } = await supabase
        .from('event_applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);
        
      if (error) {
        console.error('Error approving application:', error);
        throw error;
      }
      
      // Update local state to reflect the change immediately
      if (updateApplicationStatus) {
        updateApplicationStatus(applicationId, 'accepted');
      }
      
      // Mark other applications as rejected for this service category if specified
      if (applicationData.service_category) {
        await supabase
          .from('event_applications')
          .update({ status: 'rejected' })
          .eq('event_id', event.id)
          .eq('service_category', applicationData.service_category)
          .neq('id', applicationId);
          
        console.log('Rejected other applications for service category:', applicationData.service_category);
      } else {
        // If no service category, reject all other applications for this event
        await supabase
          .from('event_applications')
          .update({ status: 'rejected' })
          .eq('event_id', event.id)
          .neq('id', applicationId);
          
        console.log('Rejected all other applications for this event');
      }
      
      // Update event status to published if it's not already
      if (event.status !== 'published') {
        await supabase
          .from('events')
          .update({ status: 'published' })
          .eq('id', event.id);
          
        console.log('Updated event status to published');
      }
      
      // Check if a conversation already exists between these users
      const { data: existingConversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', event.contractor_id);
        
      let existingConversationId = null;
      
      if (existingConversations && existingConversations.length > 0) {
        const contractorConversationIds = existingConversations.map(c => c.conversation_id);
        
        const { data: providerConversations } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', providerId)
          .in('conversation_id', contractorConversationIds);
          
        if (providerConversations && providerConversations.length > 0) {
          existingConversationId = providerConversations[0].conversation_id;
        }
      }
      
      // Create a conversation only if one doesn't exist
      let conversationId;
      
      if (existingConversationId) {
        conversationId = existingConversationId;
        console.log('Using existing conversation:', conversationId);
      } else {
        // Create a new conversation
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            service_request_id: null
          })
          .select()
          .single();
        
        if (conversationError) {
          console.error('Error creating conversation:', conversationError);
          throw conversationError;
        }
        
        conversationId = conversation.id;
        
        // Add both participants to the conversation
        await supabase
          .from('conversation_participants')
          .insert([
            { conversation_id: conversationId, user_id: event.contractor_id },
            { conversation_id: conversationId, user_id: providerId }
          ]);
          
        console.log('Created conversation and added participants');
      }
      
      // Send notification to provider
      try {
        await sendProviderNotification(
          event,
          providerId,
          "Parabéns! Você foi aprovado para um evento",
          `Sua candidatura para o evento "${event.name}" foi aprovada!`,
          "application_approved"
        );
        console.log('Approval notification sent to provider:', providerId);
      } catch (notificationError) {
        console.error('Error sending approval notification:', notificationError);
      }
      
      // Update service request filled count
      if (event.service_requests && event.service_requests.length > 0 && applicationData.service_category) {
        await updateServiceRequestFilledCount(event, applicationData.service_category);
      }
      
      toast.success("Candidatura aprovada! Redirecionando para o chat...");
      
      // Redirect to chat with a slight delay to allow toast to be seen
      setTimeout(() => {
        navigate('/chat');
      }, 1500);
    } catch (error: any) {
      console.error('Erro ao aprovar candidatura:', error);
      toast.error(error.message || 'Ocorreu um erro ao aprovar a candidatura');
    } finally {
      setApproving(false);
    }
  };

  /**
   * Updates the filled count for a specific service category in the event
   */
  const updateServiceRequestFilledCount = async (event: Event, serviceCategory: string) => {
    // Get current service_requests
    const updatedServiceRequests = [...event.service_requests as ServiceRequest[]].map(req => {
      if (req.category === serviceCategory) {
        return {
          ...req,
          filled: (req.filled || 0) + 1
        };
      }
      return req;
    });
    
    // Convert ServiceRequest[] to Json for database storage
    const serviceRequestsJson: Json = updatedServiceRequests.map(req => ({
      category: req.category,
      count: req.count,
      price: req.price,
      filled: req.filled
    })) as unknown as Json;
    
    // Update the event with the new filled count
    await supabase
      .from('events')
      .update({ service_requests: serviceRequestsJson })
      .eq('id', event.id);
      
    console.log('Updated service request filled count for category:', serviceCategory);
  };

  return {
    approving,
    handleApproveApplication
  };
};
