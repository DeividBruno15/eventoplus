
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Message } from '@/types/chat';

interface MessagesProps {
  messages: Message[];
  currentUserId: string;
}

export default function Messages({ messages, currentUserId }: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'HH:mm', { locale: ptBR });
  };

  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return format(date, "dd 'de' MMMM", { locale: ptBR });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { date: string; messages: Message[] }[], message) => {
    const dateStr = new Date(message.created_at).toDateString();
    const existingGroup = groups.find(group => new Date(group.date).toDateString() === dateStr);
    
    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groups.push({
        date: message.created_at,
        messages: [message]
      });
    }
    
    return groups;
  }, []);

  return (
    <div className="flex-grow overflow-y-auto p-4 bg-muted/30">
      <div className="space-y-6">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="flex justify-center mb-4">
              <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                {formatMessageDate(group.date)}
              </span>
            </div>
            
            <div className="space-y-2">
              {group.messages.map((message) => {
                const isMine = message.sender_id === currentUserId;
                
                return (
                  <div 
                    key={message.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[75%] px-4 py-2 rounded-lg break-words ${
                        isMine 
                          ? 'bg-primary text-primary-foreground rounded-br-none' 
                          : 'bg-muted rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.message}</p>
                      <div 
                        className={`text-xs mt-1 ${
                          isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}
                      >
                        {formatMessageTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
