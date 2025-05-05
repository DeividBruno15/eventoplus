
import { motion } from 'framer-motion';
import { Building, Image, MapPin, DollarSign, Check } from 'lucide-react';

interface VenueListingAnimationProps {
  animationStep: number;
}

const VenueListingAnimation = ({ animationStep }: VenueListingAnimationProps) => {
  const venueListingSteps = [
    { step: 1, title: 'Dados do local', icon: Building, completed: false },
    { step: 2, title: 'Endereço', icon: MapPin, completed: false },
    { step: 3, title: 'Fotos e mídias', icon: Image, completed: false },
    { step: 4, title: 'Preços e disponibilidade', icon: DollarSign, completed: false }
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
          <Building className="h-5 w-5 text-secondary" />
          Anunciar Novo Local para Eventos
        </h3>
      </div>
      
      <div className="space-y-6 mb-4">
        {venueListingSteps.map((step, idx) => (
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
              idx <= animationStep ? 'bg-secondary text-white' : 'bg-gray-100'
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
                  className="h-1 bg-secondary mt-2 rounded-full"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: animationStep === venueListingSteps.length - 1 ? 1 : 0,
          y: animationStep === venueListingSteps.length - 1 ? 0 : 20
        }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 rounded-xl p-4 mt-6"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Check className="w-4 h-4 text-secondary" />
          <span>Local anunciado com sucesso!</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VenueListingAnimation;
