
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4 py-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
          <p className="text-2xl font-semibold text-gray-700">Página não encontrada</p>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-500">
            A página que você está procurando não existe ou foi movida.
          </p>
          <p className="text-gray-500 mt-1">
            Verifique o endereço ou use os links abaixo para continuar.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <Button 
            className="flex items-center gap-2"
            onClick={handleGoHome}
          >
            <Home className="h-4 w-4" />
            Página Inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
