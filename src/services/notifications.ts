
import { supabase } from '@/integrations/supabase/client';

interface SendWhatsAppParams {
  userId: string;
  phoneNumber: string;
  message: string;
}

export const notificationsService = {
  /**
   * Envia uma notificação via WhatsApp
   */
  async sendWhatsAppNotification({ userId, phoneNumber, message }: SendWhatsAppParams): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-notification', {
        body: {
          user_id: userId,
          phone_number: phoneNumber,
          message,
        },
      });

      if (error) {
        console.error('Erro ao enviar notificação WhatsApp:', error);
        return false;
      }

      return data.success;
    } catch (error) {
      console.error('Erro ao enviar notificação WhatsApp:', error);
      return false;
    }
  },

  /**
   * Envia uma notificação ao usuário
   */
  async sendNotification({
    userId,
    title,
    content,
    type,
    link,
  }: {
    userId: string;
    title: string;
    content: string;
    type: string;
    link?: string;
  }): Promise<boolean> {
    try {
      console.log(`Enviando notificação para ${userId}: ${title}`);
      
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          content,
          type,
          link,
        } as any);

      if (error) {
        console.error('Erro ao criar notificação:', error);
        return false;
      }

      // Buscar informações do usuário para enviar WhatsApp
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('phone_number')
        .eq('id', userId)
        .single();

      if (userError || !userData?.phone_number) {
        console.log('Usuário sem número de telefone ou erro:', userError);
        return true; // Retorna true pois a notificação foi criada com sucesso, apenas o WhatsApp falhou
      }

      // Enviar também via WhatsApp se o usuário tiver um número de telefone
      await this.sendWhatsAppNotification({
        userId,
        phoneNumber: userData.phone_number,
        message: `${title}\n\n${content}${link ? `\n\nAcesse: ${window.location.origin}${link}` : ''}`,
      });

      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    }
  },

  /**
   * Marca uma notificação como lida
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return false;
    }
  },

  /**
   * Busca as notificações do usuário
   */
  async getUserNotifications(userId: string, limit: number = 10, offset: number = 0) {
    try {
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Erro ao buscar notificações:', error);
        return { data: [], count: 0 };
      }

      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return { data: [], count: 0 };
    }
  },

  /**
   * Configura um listener para notificações em tempo real
   */
  subscribeToNotifications(
    userId: string, 
    callback: (notification: any) => void
  ) {
    const channel = supabase
      .channel(`user_notifications:${userId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
