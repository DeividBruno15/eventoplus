
import { useState, useEffect } from 'react';
import ChatAnimation from './hero/ChatAnimation';
import EventCreationAnimation from './hero/EventCreationAnimation';
import VenueListingAnimation from './hero/VenueListingAnimation';
import HeroContent from './hero/HeroContent';

const Hero = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('chat');
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (animationPhase === 'chat') {
        if (animationStep === 3) { // Number of chat messages - 1
          setAnimationPhase('event');
          setAnimationStep(0);
        } else {
          setAnimationStep(prev => prev + 1);
        }
      } else if (animationPhase === 'event') {
        if (animationStep === 3) { // Number of event steps - 1
          setAnimationPhase('venue');
          setAnimationStep(0);
        } else {
          setAnimationStep(prev => prev + 1);
        }
      } else if (animationPhase === 'venue') {
        if (animationStep === 3) { // Number of venue steps - 1
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
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px] grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <HeroContent />
        
        <div className="relative">
          {animationPhase === 'chat' ? (
            <ChatAnimation animationStep={animationStep} />
          ) : animationPhase === 'event' ? (
            <EventCreationAnimation animationStep={animationStep} />
          ) : (
            <VenueListingAnimation animationStep={animationStep} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
