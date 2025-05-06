
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  city: string;
  coverImage: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
}

interface ProviderProfileHeaderProps {
  provider: Provider;
}

export const ProviderProfileHeader = ({ provider }: ProviderProfileHeaderProps) => {
  return (
    <>
      {/* Cover Image */}
      <div className="relative h-60 md:h-80">
        <img 
          src={provider.coverImage} 
          alt={`${provider.name} cover`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      {/* Profile Info */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
            <img 
              src={provider.profileImage} 
              alt={provider.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 pt-4 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-black md:text-white">{provider.name}</h1>
                <p className="text-gray-700 md:text-gray-200">{provider.city}</p>
              </div>
              <div className="flex items-center mt-2 md:mt-0">
                <div className="flex items-center bg-white px-3 py-1 rounded-full mr-3 shadow-sm">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-medium">{provider.rating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm ml-1">({provider.reviewCount})</span>
                </div>
                <Link to={`/request-quote/${provider.id}`}>
                  <Button className="bg-primary">Solicitar orçamento</Button>
                </Link>
              </div>
            </div>
            <div className="flex mt-2">
              <Link to={`/users/${provider.id}`} className="text-sm text-primary md:text-primary-foreground hover:underline">
                Ver perfil completo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
