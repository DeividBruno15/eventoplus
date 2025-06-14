
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { OnboardingModal } from './onboarding/OnboardingModal';

const CallToAction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-16 bg-primary rounded-3xl overflow-hidden mx-4 md:mx-8 my-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary/80 z-[-1]"></div>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para transformar suas ideias em eventos incríveis?
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Junte-se à comunidade Evento+ e conecte-se com profissionais qualificados e espaços perfeitos para seus eventos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="secondary" 
              size="lg"
              className="px-6 py-4 h-auto text-md font-medium bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Cadastrar como Contratante
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="px-6 py-4 h-auto text-md font-medium border-white text-white bg-primary/30 hover:bg-white/20 w-full sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Cadastrar como Prestador
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="px-6 py-4 h-auto text-md font-medium border-accent bg-accent/80 text-white hover:bg-accent w-full sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Cadastrar como Anunciante
            </Button>
          </div>
        </div>
      </section>

      <OnboardingModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  );
};

export default CallToAction;
