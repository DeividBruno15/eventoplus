
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EventApplication } from '@/types/events';
import { ApplicationMessage } from './ApplicationMessage';
import { ApprovedApplication } from './ApprovedApplication';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExistingApplicationProps {
  userApplication: EventApplication;
  onCancelApplication: () => void;
}

export const ExistingApplication = ({ userApplication, onCancelApplication }: ExistingApplicationProps) => {
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [currentStatus, setCurrentStatus] = useState<string>(userApplication.status);
  
  // Log status on render para debug
  useEffect(() => {
    console.log('ExistingApplication rendering with status:', userApplication.status);
    setCurrentStatus(userApplication.status);
  }, [userApplication.status]);
  
  // Configure realtime subscription to application status changes
  useEffect(() => {
    if (!userApplication?.id) return;
    
    // Subscribe to changes to this specific application
    const channel = supabase
      .channel(`application_status_${userApplication.id}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE',
          schema: 'public', 
          table: 'event_applications',
          filter: `id=eq.${userApplication.id}`
        }, 
        (payload) => {
          console.log('Realtime update for application:', payload);
          if (payload.new && payload.new.status) {
            setCurrentStatus(payload.new.status);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userApplication?.id]);
  
  // Fetch conversation ID if application is accepted
  useEffect(() => {
    const fetchConversation = async () => {
      if (currentStatus === 'accepted' && userApplication.provider_id) {
        try {
          // Fazendo uma consulta para obter o contratante do evento
          const { data: eventData, error: eventError } = await supabase
            .from('events')
            .select('contractor_id')
            .eq('id', userApplication.event_id)
            .single();
            
          if (eventError) {
            console.error('Error fetching event contractor ID:', eventError);
            return;
          }
          
          if (!eventData || !eventData.contractor_id) {
            console.error('No contractor ID found for event');
            return;
          }
          
          const { data, error } = await supabase.rpc(
            'create_or_get_conversation',
            {
              user_id_one: userApplication.provider_id,
              user_id_two: eventData.contractor_id
            }
          );
          
          if (error) {
            console.error('Error fetching conversation:', error);
            return;
          }
          
          setConversationId(data);
        } catch (error) {
          console.error('Error in conversation fetch:', error);
        }
      }
    };
    
    if (currentStatus === 'accepted') {
      fetchConversation();
    }
  }, [currentStatus, userApplication]);
  
  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };
  
  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      default: return 'Pendente';
    }
  };
  
  // Set container class based on status
  const containerClass = cn(
    'border p-4 rounded-lg',
    currentStatus === 'accepted' ? 'border-green-500 bg-green-50' : 
    currentStatus === 'rejected' ? 'border-red-500 bg-red-50' : 
    'border-gray-300'
  );
  
  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Sua candidatura</h3>
        <Badge 
          className={cn("text-white", getApplicationStatusColor(currentStatus))}
        >
          {getApplicationStatusText(currentStatus)}
        </Badge>
      </div>
      
      <ApplicationMessage message={userApplication.message} className="mb-4" />
      
      {currentStatus === 'pending' && (
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={onCancelApplication}
        >
          Cancelar Candidatura
        </Button>
      )}
      
      {currentStatus === 'accepted' && (
        <ApprovedApplication conversationId={conversationId} />
      )}
      
      {currentStatus === 'rejected' && (
        <div className="text-center my-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">Sua candidatura para este evento foi rejeitada.</p>
          <p className="text-gray-600 mt-2">Você pode procurar outros eventos disponíveis ou entrar em contato para mais informações.</p>
        </div>
      )}
    </div>
  );
};
