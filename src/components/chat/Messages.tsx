
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
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
    <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
      <div className="space-y-8">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="flex justify-center mb-6">
              <span className="bg-white px-4 py-1.5 rounded-full text-xs text-gray-500 shadow-sm border">
                {formatMessageDate(group.date)}
              </span>
            </div>
            
            <div className="space-y-4">
              {group.messages.map((message) => {
                const isMine = message.sender_id === currentUserId;
                
                return (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[75%] px-4 py-3 rounded-2xl break-words shadow-sm ${
                        isMine 
                          ? 'bg-primary text-primary-foreground rounded-br-sm' 
                          : 'bg-white rounded-bl-sm border border-gray-100'
                      }`}
                    >
                      <p className="whitespace-pre-line text-[15px]">{message.message}</p>
                      <div 
                        className={`text-[11px] mt-1 ${
                          isMine ? 'text-primary-foreground/70' : 'text-gray-400'
                        }`}
                      >
                        {formatMessageTime(message.created_at)}
                      </div>
                    </div>
                  </motion.div>
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
