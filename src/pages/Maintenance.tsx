
import { motion } from 'framer-motion';
import MaintenanceIllustration from '@/components/maintenance/MaintenanceIllustration';
import MaintenanceContent from '@/components/maintenance/MaintenanceContent';
import MaintenanceFooter from '@/components/maintenance/MaintenanceFooter';
import BackgroundEffects from '@/components/maintenance/BackgroundEffects';

const Maintenance = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-primary/5 flex flex-col">
      {/* Efeitos decorativos de background */}
      <BackgroundEffects />
      
      <div className="container mx-auto px-4 py-12 flex-1 flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
        {/* Ilustração */}
        <MaintenanceIllustration />
        
        {/* Conteúdo de texto */}
        <MaintenanceContent />
      </div>
      
      <MaintenanceFooter />
    </div>
  );
};

export default Maintenance;
