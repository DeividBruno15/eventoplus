
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
        <Hero />
        <FeatureSection />
        <ServiceCategories />
        <UserTypeSection />
        <TestimonialSection />
        <PlanSection />
        <FAQ />
        <CallToAction />
      </main>
    </div>
  );
};

export default Index;
