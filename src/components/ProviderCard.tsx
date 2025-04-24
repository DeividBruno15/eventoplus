
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProviderCardProps {
  id: string;
  name: string;
  services: string[];
  rating: number;
  city: string;
  image: string;
}

const ProviderCard = ({ id, name, services, rating, city, image }: ProviderCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-muted overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md flex items-center shadow-sm">
          <Star className="w-4 h-4 text-secondary fill-secondary mr-1" />
          <span className="font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-3">{city}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {services.map((service, index) => (
            <span 
              key={index}
              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
            >
              {service}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <Link to={`/provider-profile/${id}`}>
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Ver perfil
            </Button>
          </Link>
          <Link to={`/request-quote/${id}`}>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              Orçamento
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
