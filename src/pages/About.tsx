
import AboutHero from '../components/about/AboutHero';
import UserTypesSection from '../components/about/UserTypesSection';
import MissionVision from '../components/about/MissionVision';
import FeaturesSection from '../components/about/FeaturesSection';
import TeamSection from '../components/about/TeamSection';
import AboutCTA from '../components/about/AboutCTA';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <main className="container py-16">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section */}
          <AboutHero />
          
          {/* User Types Section */}
          <UserTypesSection />
          
          {/* Mission & Vision */}
          <MissionVision />
          
          {/* Features Section */}
          <FeaturesSection />
          
          {/* Team Section */}
          <TeamSection />
          
          {/* CTA Section */}
          <AboutCTA />
        </div>
      </main>
    </div>
  );
};

export default About;
