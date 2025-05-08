
import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useNotificationSounds() {
  const messageAudioRef = useRef<HTMLAudioElement | null>(null);
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    // Create audio elements
    if (typeof window !== 'undefined') {
      messageAudioRef.current = new Audio('/sounds/message.mp3');
      notificationAudioRef.current = new Audio('/sounds/notification.mp3');
      
      // Check user preferences
      if (user?.id) {
        // Get user sound preferences from localStorage or database
        const userSoundPref = localStorage.getItem('notification_sounds');
        if (userSoundPref !== null) {
          setSoundsEnabled(userSoundPref === 'true');
        }
      }
    }
    
    return () => {
      messageAudioRef.current = null;
      notificationAudioRef.current = null;
    };
  }, [user?.id]);
  
  const playMessageSound = () => {
    if (soundsEnabled && messageAudioRef.current) {
      messageAudioRef.current.play().catch(error => {
        console.error('Error playing message sound:', error);
      });
    }
  };
  
  const playNotificationSound = () => {
    if (soundsEnabled && notificationAudioRef.current) {
      notificationAudioRef.current.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    }
  };
  
  const toggleSounds = () => {
    const newValue = !soundsEnabled;
    setSoundsEnabled(newValue);
    localStorage.setItem('notification_sounds', String(newValue));
    
    // Optionally save to user profile in database
    if (user?.id) {
      supabase
        .from('user_profiles')
        .update({ notifications_sound: newValue })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) console.error('Error saving sound preferences:', error);
        });
    }
  };
  
  return {
    soundsEnabled,
    toggleSounds,
    playMessageSound,
    playNotificationSound
  };
}
