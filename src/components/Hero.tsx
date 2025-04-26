import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Heart, Star, Calendar, MapPin, MessageCircle, Users, Camera, Music } from 'lucide-react';

const Hero = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('chat');
  
  const messageSequence = [
    { sender: 'contractor', message: 'Preciso de um buffet para evento corporativo.' },
    { sender: 'provider', message: 'Olá! Temos várias opções. Qual a data do evento?' },
    { sender: 'contractor', message: 'No próximo mês, dia 15.' },
    { sender: 'provider', message: 'Perfeito! Posso te enviar nosso cardápio?' }
  ];

  const eventCreationSteps = [
    { step: 1, title: 'Dados básicos', icon: Calendar, completed: false },
    { step: 2, title: 'Local e Data', icon: MapPin, completed: false },
    { step: 3, title: 'Serviços', icon: Users, completed: false },
    { step: 4, title: 'Fotos e Mídia', icon: Camera, completed: false }
  ];

  // Animation sequence timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (animationPhase === 'chat') {
        if (animationStep === messageSequence.length - 1) {
          setAnimationPhase('event');
          setAnimationStep(0);
        } else {
          setAnimationStep(prev => prev + 1);
        }
      } else if (animationPhase === 'event') {
        if (animationStep === eventCreationSteps.length - 1) {
          setAnimationPhase('chat');
          setAnimationStep(0);
        } else {
          setAnimationStep(prev => prev + 1);
        }
      }
    }, 3000);
    
    return () => clearInterval(timer);
  }, [animationStep, animationPhase]);

  return (
    <div className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/80 pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Organize eventos com facilidade e encontre os melhores prestadores
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
              Conectamos contratantes a prestadores de serviços qualificados para tornar seu evento inesquecível.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              to="/register" 
              className="btn-primary text-center px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors shadow-lg shadow-primary/20 animate-scale-in"
            >
              Começar agora
            </Link>
            <Link 
              to="/about" 
              className="btn-outline text-center px-8 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary/5 font-medium transition-colors animate-scale-in"
            >
              Saiba mais
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-5 pt-2"
          >
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-full p-1">
                <Check className="text-primary h-4 w-4" />
              </div>
              <span className="text-sm text-gray-600">Sem taxas ocultas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-full p-1">
                <Check className="text-primary h-4 w-4" />
              </div>
              <span className="text-sm text-gray-600">Chat integrado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-full p-1">
                <Check className="text-primary h-4 w-4" />
              </div>
              <span className="text-sm text-gray-600">Orçamentos personalizados</span>
            </div>
          </motion.div>
        </div>

        <div className="relative">
          {/* Chat animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: animationPhase === 'chat' ? 1 : 0,
              scale: animationPhase === 'chat' ? 1 : 0.95,
              x: animationPhase === 'chat' ? 0 : -50
            }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-5 relative z-10 max-w-md mx-auto"
          >
            <div className="border-b pb-3 mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Chat Evento+
              </h3>
            </div>
            
            <div className="space-y-4 mb-4 h-[280px] overflow-hidden">
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

            {/* Event details animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="border-t pt-4"
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

          {/* Event Creation Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: animationPhase === 'event' ? 1 : 0,
              scale: animationPhase === 'event' ? 1 : 0.95,
              x: animationPhase === 'event' ? 0 : 50
            }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-5 relative z-10 max-w-md mx-auto absolute top-0 left-0 w-full"
          >
            <div className="border-b pb-3 mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Criar Novo Evento
              </h3>
            </div>
            
            <div className="space-y-6 mb-4">
              {eventCreationSteps.map((step, idx) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: idx <= animationStep ? 1 : 0.5,
                    y: idx <= animationStep ? 0 : 20,
                  }}
                  transition={{ duration: 0.3, delay: idx * 0.2 }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    idx <= animationStep ? 'bg-primary text-white' : 'bg-gray-100'
                  }`}>
                    {idx < animationStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      idx <= animationStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    {idx === animationStep && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                        className="h-1 bg-primary mt-2 rounded-full"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: animationStep === eventCreationSteps.length - 1 ? 1 : 0,
                y: animationStep === eventCreationSteps.length - 1 ? 0 : 20
              }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-xl p-4 mt-6"
            >
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-primary" />
                <span>Evento criado com sucesso!</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
