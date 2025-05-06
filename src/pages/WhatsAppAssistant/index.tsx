
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWhatsAppMessages } from '@/hooks/useWhatsAppMessages';
import { MessagesPanel } from './components/MessagesPanel';
import { SettingsCard } from './components/SettingsCard';
import { InfoCard } from './components/InfoCard';

const WhatsAppAssistant = () => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  // Use our custom hook
  const { 
    messages, 
    isLoading, 
    phoneNumber, 
    whatsappEnabled,
    sendMessage, 
    toggleWhatsAppPreference 
  } = useWhatsAppMessages();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      setNewMessage('');

      const success = await sendMessage(newMessage);
      
      if (!success) {
        throw new Error('Falha ao enviar mensagem');
      }
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso via WhatsApp",
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleWhatsApp = async () => {
    const success = await toggleWhatsAppPreference();
    
    if (success) {
      toast({
        title: whatsappEnabled ? "WhatsApp desativado" : "WhatsApp ativado",
        description: whatsappEnabled 
          ? "Você não receberá mais notificações via WhatsApp" 
          : "Você receberá notificações via WhatsApp",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar sua preferência de WhatsApp",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Assistente WhatsApp</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MessagesPanel
            messages={messages}
            isLoading={isLoading}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            isSending={isSending}
            whatsappEnabled={whatsappEnabled}
            phoneNumber={phoneNumber}
          />
        </div>
        
        <div className="space-y-6">
          <SettingsCard
            whatsappEnabled={whatsappEnabled}
            phoneNumber={phoneNumber}
            handleToggleWhatsApp={handleToggleWhatsApp}
          />
          <InfoCard />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppAssistant;
