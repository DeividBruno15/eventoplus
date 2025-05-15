
// Este é apenas um exemplo de como padronizar os espaçamentos em todas as páginas
// Adicione a classe "section-padding" aos containers principais das suas páginas

import React from 'react';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import ServiceCategories from '@/components/ServiceCategories';
import UserTypeSection from '@/components/UserTypeSection';
import TestimonialSection from '@/components/TestimonialSection';
import PlanSection from '@/components/PlanSection';
import FAQ from '@/components/FAQ';
import CallToAction from '@/components/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <section className="section-padding">
          <Hero />
        </section>
        
        <section className="section-padding bg-muted/30">
          <FeatureSection />
        </section>
        
        <section className="section-padding">
          <ServiceCategories />
        </section>
        
        <section className="section-padding bg-muted/30">
          <UserTypeSection />
        </section>
        
        <section className="section-padding">
          <TestimonialSection />
        </section>
        
        <section className="section-padding bg-muted/30">
          <PlanSection />
        </section>
        
        <section className="section-padding">
          <FAQ />
        </section>
        
        <section className="section-padding bg-primary/5">
          <CallToAction />
        </section>
      </main>
    </div>
  );
};

export default Index;
