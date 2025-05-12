
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  duration?: number;
  redirect?: string;
}

export const SplashScreen = ({ 
  duration = 3000, 
  redirect = '/login' 
}: SplashScreenProps) => {
  const [show, setShow] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => {
        setShouldRedirect(true);
      }, 500); // Small delay for the animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (shouldRedirect) {
    return <Navigate to={redirect} replace />;
  }

  return (
    <>
      {show && (
        <motion.div 
          className="fixed inset-0 bg-primary flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.h1 
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Evento+
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-4"
            >
              <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin mx-auto"></div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
};
