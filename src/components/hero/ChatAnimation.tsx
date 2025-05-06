
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, MapPin, Heart } from 'lucide-react';

interface ChatAnimationProps {
  animationStep: number;
}

const ChatAnimation = ({ animationStep }: ChatAnimationProps) => {
  const messageSequence = [
    { sender: 'contractor', message: 'Preciso de um buffet para evento corporativo.' },
    { sender: 'provider', message: 'Olá! Temos várias opções. Qual a data do evento?' },
    { sender: 'contractor', message: 'No próximo mês, dia 15.' },
    { sender: 'provider', message: 'Perfeito! Posso te enviar nosso cardápio?' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-5 relative z-10 max-w-md mx-auto h-[400px] flex flex-col"
    >
      <div className="border-b pb-3 mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Chat Evento+
        </h3>
      </div>
      
      <div className="space-y-4 mb-4 flex-1 overflow-hidden">
        {messageSequence.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: idx <= animationStep ? 1 : 0, y: idx <= animationStep ? 0 : 20 }}
            transition={{ duration: 0.3, delay: idx * 0.2 }}
            className={`flex items-start gap-3 ${msg.sender === 'provider' ? '' : 'justify-end'}`}
          >
            {msg.sender === 'provider' && (
              <div className="bg-secondary text-white h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                PS
              </div>
            )}
            <div className={`${msg.sender === 'provider' ? 'bg-gray-100' : 'bg-primary text-white'} py-2 px-4 rounded-2xl max-w-[75%]`}>
              <p className="text-sm">{msg.message}</p>
            </div>
            {msg.sender === 'contractor' && (
              <div className="bg-primary-foreground border border-primary/20 h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium text-primary flex-shrink-0">
                JD
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="border-t pt-4 mt-auto"
      >
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Detalhes do Evento
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-gray-500" />
              <span>15 de Junho, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-gray-500" />
              <span>São Paulo, SP</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-3.5 w-3.5 text-gray-500" />
              <span>Buffet Corporativo</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatAnimation;
