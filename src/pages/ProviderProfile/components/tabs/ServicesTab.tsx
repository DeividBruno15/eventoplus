
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ServicesTabProps {
  services: string[];
  providerId: string;
}

export const ServicesTab = ({ services, providerId }: ServicesTabProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Serviços Oferecidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <div key={index} className="flex items-center p-4 border border-muted rounded-md">
            <div className="bg-primary/10 rounded-full p-2 mr-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>{service}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-700 mb-4">
          Interessado em nossos serviços? Solicite um orçamento personalizado agora!
        </p>
        <Link to={`/request-quote/${providerId}`}>
          <Button className="bg-primary">Solicitar orçamento</Button>
        </Link>
      </div>
    </>
  );
};
