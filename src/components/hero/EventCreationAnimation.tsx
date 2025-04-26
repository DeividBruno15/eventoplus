
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Camera, Check } from 'lucide-react';

interface EventCreationAnimationProps {
  animationStep: number;
}

const EventCreationAnimation = ({ animationStep }: EventCreationAnimationProps) => {
  const eventCreationSteps = [
    { step: 1, title: 'Dados básicos', icon: Calendar, completed: false },
    { step: 2, title: 'Local e Data', icon: MapPin, completed: false },
    { step: 3, title: 'Serviços', icon: Users, completed: false },
    { step: 4, title: 'Fotos e Mídia', icon: Camera, completed: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-5 relative z-10 max-w-md mx-auto"
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
  );
};

export default EventCreationAnimation;
