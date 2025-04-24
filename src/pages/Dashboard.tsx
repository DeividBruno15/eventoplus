
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userType] = useState<'contratante' | 'prestador'>('contratante');
  
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-muted p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-xl font-bold">JS</span>
                </div>
                <div>
                  <h3 className="font-semibold">João Silva</h3>
                  <p className="text-sm text-gray-500">
                    {userType === 'contratante' ? 'Contratante' : 'Prestador de Serviços'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-muted overflow-hidden">
              <nav className="flex flex-col">
                <button 
                  className={`text-left px-6 py-3 border-l-2 ${
                    activeTab === 'overview' 
                      ? 'border-primary text-primary bg-primary/5 font-medium' 
                      : 'border-transparent'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Visão Geral
                </button>

                {userType === 'contratante' && (
                  <>
                    <button 
                      className={`text-left px-6 py-3 border-l-2 ${
                        activeTab === 'find' 
                          ? 'border-primary text-primary bg-primary/5 font-medium' 
                          : 'border-transparent'
                      }`}
                      onClick={() => setActiveTab('find')}
                    >
                      Buscar Prestadores
                    </button>
                    <button 
                      className={`text-left px-6 py-3 border-l-2 ${
                        activeTab === 'quotes' 
                          ? 'border-primary text-primary bg-primary/5 font-medium' 
                          : 'border-transparent'
                      }`}
                      onClick={() => setActiveTab('quotes')}
                    >
                      Meus Orçamentos
                    </button>
                    <button 
                      className={`text-left px-6 py-3 border-l-2 ${
                        activeTab === 'history' 
                          ? 'border-primary text-primary bg-primary/5 font-medium' 
                          : 'border-transparent'
                      }`}
                      onClick={() => setActiveTab('history')}
                    >
                      Histórico
                    </button>
                  </>
                )}

                {userType === 'prestador' && (
                  <>
                    <button 
                      className={`text-left px-6 py-3 border-l-2 ${
                        activeTab === 'profile' 
                          ? 'border-primary text-primary bg-primary/5 font-medium' 
                          : 'border-transparent'
                      }`}
                      onClick={() => setActiveTab('profile')}
                    >
                      Meu Perfil
                    </button>
                    <button 
                      className={`text-left px-6 py-3 border-l-2 ${
                        activeTab === 'quotes' 
                          ? 'border-primary text-primary bg-primary/5 font-medium' 
                          : 'border-transparent'
                      }`}
                      onClick={() => setActiveTab('quotes')}
                    >
                      Orçamentos
                    </button>
                    <button 
                      className={`text-left px-6 py-3 border-l-2 ${
                        activeTab === 'calendar' 
                          ? 'border-primary text-primary bg-primary/5 font-medium' 
                          : 'border-transparent'
                      }`}
                      onClick={() => setActiveTab('calendar')}
                    >
                      Agenda
                    </button>
                  </>
                )}

                <button 
                  className={`text-left px-6 py-3 border-l-2 ${
                    activeTab === 'settings' 
                      ? 'border-primary text-primary bg-primary/5 font-medium' 
                      : 'border-transparent'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  Configurações
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Bem-vindo, João!</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold mb-1">
                        {userType === 'contratante' ? 'Orçamentos' : 'Serviços'}
                      </h2>
                      <p className="text-3xl font-bold text-primary">3</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                      <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold mb-1">
                        {userType === 'contratante' ? 'Eventos' : 'Eventos Agendados'}
                      </h2>
                      <p className="text-3xl font-bold text-secondary">1</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold mb-1">
                        {userType === 'contratante' ? 'Contratações' : 'Avaliações'}
                      </h2>
                      <p className="text-3xl font-bold text-gray-700">2</p>
                    </CardContent>
                  </Card>
                </div>

                {userType === 'contratante' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Prestadores recomendados</CardTitle>
                      <CardDescription>
                        Baseado nos seus interesses e localização
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mockProviders.map((provider) => (
                          <div key={provider.id} className="border border-muted rounded-lg overflow-hidden">
                            <img 
                              src={provider.image} 
                              alt={provider.name}
                              className="w-full h-32 object-cover"
                            />
                            <div className="p-4">
                              <h3 className="font-semibold mb-1">{provider.name}</h3>
                              <p className="text-sm text-gray-500 mb-2">{provider.city}</p>
                              <div className="flex mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(provider.rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="text-xs ml-1">
                                  {provider.rating.toFixed(1)}
                                </span>
                              </div>
                              <Link to={`/provider-profile/${provider.id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  Ver perfil
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <Link to="/service-providers">
                          <Button variant="link" className="text-primary">
                            Ver todos os prestadores
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {userType === 'prestador' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Orçamentos recentes</CardTitle>
                      <CardDescription>
                        Solicitações de orçamento pendentes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3].map((_, index) => (
                          <div key={index} className="border border-muted rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">Casamento</h3>
                                <p className="text-sm text-gray-500">
                                  Maria Oliveira • São Paulo, SP
                                </p>
                                <p className="text-sm mt-2">
                                  Data do evento: 15/12/2023
                                </p>
                              </div>
                              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                Pendente
                              </span>
                            </div>
                            <div className="mt-4">
                              <Button size="sm" className="bg-primary mr-2">
                                Responder
                              </Button>
                              <Button size="sm" variant="outline">
                                Detalhes
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Find Providers Tab */}
            {activeTab === 'find' && userType === 'contratante' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Buscar Prestadores</h1>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="col-span-2">
                        <label className="label">Tipo de serviço</label>
                        <select className="input">
                          <option value="">Todos os serviços</option>
                          <option>Buffet</option>
                          <option>DJ</option>
                          <option>Fotografia</option>
                          <option>Decoração</option>
                          <option>Iluminação</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Cidade</label>
                        <input type="text" className="input" placeholder="Qualquer cidade" />
                      </div>
                      <div>
                        <label className="label">Avaliação mínima</label>
                        <select className="input">
                          <option>Qualquer</option>
                          <option>3+ estrelas</option>
                          <option>4+ estrelas</option>
                          <option>5 estrelas</option>
                        </select>
                      </div>
                    </div>
                    <Button className="w-full bg-primary">Buscar</Button>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockProviders.map((provider) => (
                    <div key={provider.id} className="border border-muted rounded-lg overflow-hidden">
                      <img 
                        src={provider.image} 
                        alt={provider.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{provider.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{provider.city}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {provider.services.map((service, i) => (
                            <span 
                              key={i}
                              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(provider.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs ml-1">
                            {provider.rating.toFixed(1)}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link to={`/provider-profile/${provider.id}`} className="flex-1">
                            <Button variant="default" size="sm" className="w-full bg-primary">
                              Ver perfil
                            </Button>
                          </Link>
                          <Link to={`/request-quote/${provider.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              Orçamento
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline">Carregar mais</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
