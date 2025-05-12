
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const location = useLocation();
  const isAppPage = location.pathname.startsWith('/dashboard') || 
                  location.pathname.startsWith('/events') ||
                  location.pathname.startsWith('/chat') ||
                  location.pathname.startsWith('/venues') ||
                  location.pathname.startsWith('/profile') ||
                  location.pathname.startsWith('/settings') ||
                  location.pathname.startsWith('/payments') ||
                  location.pathname.startsWith('/help-center') ||
                  location.pathname.startsWith('/support') ||
                  location.pathname.startsWith('/services') ||
                  location.pathname.startsWith('/providers');
  
  return isAppPage ? children : (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default PageWrapper;
