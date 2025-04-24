
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';

const ProviderProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('portfolio');
  
  // Mock data for provider profile
  const provider = {
    id: id || '1',
    name: 'Ana Fotografia',
    tagline: 'Capturando momentos especiais com arte e sensibilidade',
    description: 'Com mais de 10 anos de experiência em fotografia para eventos, oferecemos serviços de alta qualidade para casamentos, aniversários, formaturas e eventos corporativos. Nossa equipe é especializada em capturar momentos únicos e emocionantes de forma natural e artística.',
    services: ['Fotografia', 'Filmagem', 'Álbum digital', 'Cabine de fotos'],
    rating: 4.8,
    reviewCount: 42,
    city: 'São Paulo, SP',
    coverImage: '/placeholder.svg',
    profileImage: '/placeholder.svg',
    portfolio: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg'
    ],
    reviews: [
      {
        id: '1',
        name: 'Mariana Costa',
        rating: 5,
        date: '12/10/2023',
        comment: 'Excelente trabalho! As fotos do nosso casamento ficaram perfeitas, capturando todas as emoções do dia. Super recomendo!',
        userImage: '/placeholder.svg'
      },
      {
        id: '2',
        name: 'Ricardo Almeida',
        rating: 4,
        date: '05/09/2023',
        comment: 'Muito profissional e atenciosa. As fotos do evento corporativo ficaram ótimas e foram entregues antes do prazo.',
        userImage: '/placeholder.svg'
      },
      {
        id: '3',
        name: 'Juliana Santos',
        rating: 5,
        date: '22/08/2023',
        comment: 'Ana e sua equipe são incríveis! Conseguiram capturar momentos que nem sabíamos que estavam acontecendo. Resultado final surpreendente!',
        userImage: '/placeholder.svg'
      }
    ]
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="flex-grow">
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
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({provider.reviewCount})</span>
                  </div>
                  <Link to={`/request-quote/${provider.id}`}>
                    <Button className="bg-primary">Solicitar orçamento</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Provider Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-muted overflow-hidden">
            {/* Tabs Navigation */}
            <Tabs defaultValue="portfolio" className="w-full">
              <div className="border-b">
                <TabsList className="w-full justify-start rounded-none bg-transparent border-b">
                  <TabsTrigger 
                    value="portfolio" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Portfólio
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sobre" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Sobre
                  </TabsTrigger>
                  <TabsTrigger 
                    value="servicos" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Serviços
                  </TabsTrigger>
                  <TabsTrigger 
                    value="avaliacoes" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    Avaliações
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {provider.portfolio.map((image, index) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden border border-muted">
                      <img 
                        src={image} 
                        alt={`Portfolio ${index + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* About Tab */}
              <TabsContent value="sobre" className="p-6">
                <h2 className="text-xl font-semibold mb-2">{provider.tagline}</h2>
                <p className="text-gray-700 mb-6">
                  {provider.description}
                </p>
                
                <h3 className="font-semibold mb-3">Informações de contato</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Email: contato@anafotografia.com</p>
                  <p>Telefone: (11) 98765-4321</p>
                  <p>Website: www.anafotografia.com</p>
                </div>
              </TabsContent>
              
              {/* Services Tab */}
              <TabsContent value="servicos" className="p-6">
                <h2 className="text-xl font-semibold mb-4">Serviços Oferecidos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {provider.services.map((service, index) => (
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
                  <Link to={`/request-quote/${provider.id}`}>
                    <Button className="bg-primary">Solicitar orçamento</Button>
                  </Link>
                </div>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="avaliacoes" className="p-6">
                <div className="mb-6 flex items-center">
                  <div className="mr-4">
                    <div className="text-5xl font-bold text-gray-800">
                      {provider.rating}
                    </div>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(provider.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {provider.reviewCount} avaliações
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center">
                          <span className="text-sm w-4 mr-2">{star}</span>
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ 
                                width: `${
                                  provider.reviews.filter(r => Math.floor(r.rating) === star).length / 
                                  provider.reviews.length * 100
                                }%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {provider.reviews.filter(r => Math.floor(r.rating) === star).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {provider.reviews.map((review) => (
                    <div key={review.id} className="border-b border-muted pb-6">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                          <img 
                            src={review.userImage} 
                            alt={review.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{review.name}</h3>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex mt-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProviderProfile;
