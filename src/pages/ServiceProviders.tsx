
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProviderCard from '../components/ProviderCard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

// Mock service provider data
const mockProviders = [
  {
    id: '1',
    name: 'Ana Fotografia',
    services: ['Fotografia', 'Filmagem'],
    rating: 4.8,
    city: 'São Paulo, SP',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Super Buffet Eventos',
    services: ['Buffet', 'Catering'],
    rating: 4.6,
    city: 'Rio de Janeiro, RJ',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'DJ Bruno Mix',
    services: ['DJ', 'Iluminação'],
    rating: 4.9,
    city: 'Belo Horizonte, MG',
    image: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Decorações Mágicas',
    services: ['Decoração', 'Ambientação'],
    rating: 4.7,
    city: 'Curitiba, PR',
    image: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Ilumina Eventos',
    services: ['Iluminação', 'Som'],
    rating: 4.5,
    city: 'Salvador, BA',
    image: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Segurança Total',
    services: ['Segurança'],
    rating: 4.4,
    city: 'Brasília, DF',
    image: '/placeholder.svg'
  }
];

const ServiceProviders = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  // Filter providers based on URL params
  const filteredProviders = category
    ? mockProviders.filter(provider => 
        provider.services.some(service => 
          service.toLowerCase() === category.toLowerCase()
        )
      )
    : mockProviders;
  
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');
  
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {category 
                ? `Prestadores de ${category.charAt(0).toUpperCase() + category.slice(1)}`
                : 'Prestadores de Serviços'
              }
            </h1>
            <p className="text-gray-600 mt-2">
              Encontre os melhores profissionais para o seu evento
            </p>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-64 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Filtros</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="category" className="label">Categoria</label>
                    <select id="category" className="input">
                      <option value="">Todas as categorias</option>
                      <option value="buffet" selected={category === 'buffet'}>Buffet</option>
                      <option value="dj" selected={category === 'dj'}>DJ</option>
                      <option value="fotografia" selected={category === 'fotografia'}>Fotografia</option>
                      <option value="decoracao" selected={category === 'decoracao'}>Decoração</option>
                      <option value="iluminacao" selected={category === 'iluminacao'}>Iluminação</option>
                      <option value="seguranca" selected={category === 'seguranca'}>Segurança</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="label">Cidade</label>
                    <select 
                      id="city" 
                      className="input"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    >
                      <option value="">Todas as cidades</option>
                      <option value="São Paulo">São Paulo</option>
                      <option value="Rio de Janeiro">Rio de Janeiro</option>
                      <option value="Belo Horizonte">Belo Horizonte</option>
                      <option value="Curitiba">Curitiba</option>
                      <option value="Salvador">Salvador</option>
                      <option value="Brasília">Brasília</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="rating" className="label">Avaliação mínima</label>
                    <select 
                      id="rating" 
                      className="input"
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                    >
                      <option value="">Qualquer avaliação</option>
                      <option value="3">3 estrelas ou mais</option>
                      <option value="4">4 estrelas ou mais</option>
                      <option value="5">5 estrelas</option>
                    </select>
                  </div>
                  
                  <Button className="w-full bg-primary">Aplicar filtros</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Provider List */}
          <div className="flex-1">
            {filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                  <ProviderCard 
                    key={provider.id}
                    id={provider.id}
                    name={provider.name}
                    services={provider.services}
                    rating={provider.rating}
                    city={provider.city}
                    image={provider.image}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold mb-2">Nenhum prestador encontrado</h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar seus filtros ou buscar por outra categoria.
                </p>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Voltar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceProviders;
