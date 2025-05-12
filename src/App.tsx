
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/auth/AuthProvider';
import { SplashScreen } from '@/components/splash/SplashScreen';
import { PublicRoutes } from './routes/PublicRoutes';
import { PrivateRoutes } from './routes/PrivateRoutes';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Check if splash screen has already been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    
    if (splashShown) {
      setShowSplash(false);
    } else {
      // Mark that splash screen has been shown
      sessionStorage.setItem('splashShown', 'true');
      
      // Hide splash after 3 seconds
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme-preference">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {showSplash ? (
                <Route path="/" element={<SplashScreen />} />
              ) : (
                <>
                  <PublicRoutes />
                  <PrivateRoutes />
                </>
              )}
            </Routes>
            <Toaster richColors position="top-right" />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
