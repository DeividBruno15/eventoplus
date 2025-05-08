
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PresenceState {
  [key: string]: {
    online_at: string;
    user: string;
  }[];
}

export const useUserPresence = (userId?: string) => {
  const [isOnline, setIsOnline] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!userId || !user) return;

    // Enviar presença do usuário atual
    const presenceChannel = supabase.channel('online-users');
    
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState() as PresenceState;
        
        // Verificar se o usuário específico está online
        const isUserOnline = Object.values(state).some(presences => 
          presences.some(presence => presence.user === userId)
        );
        
        setIsOnline(isUserOnline);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // Verificar se o usuário que entrou é o que estamos monitorando
        const userJoined = newPresences.some(presence => presence.user === userId);
        if (userJoined) {
          setIsOnline(true);
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        // Verificar se o usuário que saiu é o que estamos monitorando
        const userLeft = leftPresences.some(presence => presence.user === userId);
        if (userLeft) {
          setIsOnline(false);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          // Anunciar presença do usuário atual
          await presenceChannel.track({
            online_at: new Date().toISOString(),
            user: user.id
          });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [userId, user]);

  // Enviar presença do usuário atual para o canal geral
  useEffect(() => {
    if (!user) return;
    
    const broadcastPresence = supabase.channel('broadcast-presence');
    
    broadcastPresence.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Atualizar a presença a cada 30 segundos
        await broadcastPresence.track({
          online_at: new Date().toISOString(),
          user: user.id
        });
        
        const interval = setInterval(async () => {
          await broadcastPresence.track({
            online_at: new Date().toISOString(),
            user: user.id
          });
        }, 30000);
        
        return () => clearInterval(interval);
      }
    });
    
    return () => {
      supabase.removeChannel(broadcastPresence);
    };
  }, [user]);

  return { isOnline };
};
