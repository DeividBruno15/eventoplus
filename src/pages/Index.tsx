
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import ServiceCategories from '../components/ServiceCategories';
import CallToAction from '../components/CallToAction';
import PlanSection from '../components/PlanSection';
import FAQ from '../components/FAQ';
import UserTypeSection from '../components/UserTypeSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      <main>
        <Hero />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white z-[-1]"></div>
          <FeatureSection />
        </div>
        <UserTypeSection />
        <ServiceCategories />
        <div className="relative bg-gray-50 py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-green-50 opacity-50 z-[-1]"></div>
          <PlanSection />
        </div>
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
