
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import ServiceCategories from '../components/ServiceCategories';
import TestimonialSection from '../components/TestimonialSection';
import CallToAction from '../components/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main>
        <Hero />
        <FeatureSection />
        <ServiceCategories />
        <TestimonialSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
