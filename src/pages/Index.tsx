
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import ServiceCategories from '../components/ServiceCategories';
import TestimonialSection from '../components/TestimonialSection';
import CallToAction from '../components/CallToAction';
import PlanSection from '../components/PlanSection';
import FAQ from '../components/FAQ';

const Index = () => {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main>
        <Hero />
        <FeatureSection />
        <ServiceCategories />
        <PlanSection />
        <TestimonialSection />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
