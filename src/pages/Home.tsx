
import React from 'react';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import TestimonialSection from '@/components/TestimonialSection';
import CallToAction from '@/components/CallToAction';
import ServiceCategories from '@/components/ServiceCategories';
import UserTypeSection from '@/components/UserTypeSection';
import FAQ from '@/components/FAQ';
import PlanSection from '@/components/PlanSection';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeatureSection />
      <ServiceCategories />
      <UserTypeSection />
      <TestimonialSection />
      <PlanSection />
      <FAQ />
      <CallToAction />
    </div>
  );
};

export default Home;
