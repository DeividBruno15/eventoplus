
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '@/components/ui/card';
import { CheckCircle, Briefcase, Users, Calendar, Award, MapPin, Store, MessageCircle, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      
      <main className="container py-16">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Conectamos pessoas e serviços para eventos
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              A Evento+ é a plataforma completa que facilita a organização de eventos, conectando 
              contratantes a prestadores de serviços qualificados e espaços para eventos, economizando tempo e dinheiro.
            </p>
          </div>
          
          {/* User Types Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Para quem é a Evento+?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contratante Card */}
              <Card className="p-6 hover:shadow-md transition-shadow border border-gray-100 bg-gradient-to-br from-indigo-50 to-white">
                <div className="flex flex-col h-full">
                  <div className="bg-indigo-100 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                    <Briefcase className="text-indigo-600 w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Contratante</h3>
                  
                  <p className="text-gray-600 mb-5 flex-grow">
                    Pessoas ou empresas que precisam organizar eventos pessoais, corporativos ou 
                    sociais e buscam os melhores profissionais e locais para realizá-los.
                  </p>
                  
                  <ul className="space-y-3 mb-5">
                    {["Publique eventos de qualquer tamanho", "Encontre profissionais qualificados", "Receba orçamentos personalizados", "Comunique-se diretamente com prestadores"].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/register?role=contractor" className="mt-auto">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Cadastrar como Contratante
                    </Button>
                  </Link>
                </div>
              </Card>
              
              {/* Prestador Card */}
              <Card className="p-6 hover:shadow-md transition-shadow border border-gray-100 bg-gradient-to-br from-green-50 to-white">
                <div className="flex flex-col h-full">
                  <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                    <Users className="text-green-600 w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Prestador de Serviços</h3>
                  
                  <p className="text-gray-600 mb-5 flex-grow">
                    Profissionais e empresas especializados em serviços para eventos que 
                    buscam aumentar sua visibilidade, conquistar mais clientes e gerenciar projetos.
                  </p>
                  
                  <ul className="space-y-3 mb-5">
                    {["Receba solicitações de orçamento", "Expanda sua rede de clientes", "Gerencie seu portfólio online", "Chat integrado com contratantes"].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/register?role=provider" className="mt-auto">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                      Cadastrar como Prestador
                    </Button>
                  </Link>
                </div>
              </Card>
              
              {/* Anunciante Card */}
              <Card className="p-6 hover:shadow-md transition-shadow border border-gray-100 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex flex-col h-full">
                  <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                    <Store className="text-blue-600 w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Anunciante de Espaços</h3>
                  
                  <p className="text-gray-600 mb-5 flex-grow">
                    Proprietários ou gestores de locais para eventos que desejam aumentar a ocupação e 
                    visibilidade de seus espaços na plataforma.
                  </p>
                  
                  <ul className="space-y-3 mb-5">
                    {["Divulgue seus espaços para eventos", "Gerencie disponibilidade", "Receba solicitações de reserva", "Destaque seus diferenciais"].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/register?role=advertiser" className="mt-auto">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                      Cadastrar como Anunciante
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">Nossa Missão</h2>
              <p className="text-gray-700 leading-relaxed">
                Simplificar a organização de eventos através de uma plataforma que conecte 
                contratantes, prestadores de serviços e espaços de forma intuitiva e eficiente, 
                garantindo experiências memoráveis e resultados excepcionais para todos os envolvidos.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">Nossa Visão</h2>
              <p className="text-gray-700 leading-relaxed">
                Ser a plataforma líder no mercado de eventos, reconhecida pela excelência, 
                inovação e por transformar a maneira como as pessoas organizam, oferecem e 
                executam seus eventos em todo o Brasil.
              </p>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="space-y-10">
            <h2 className="text-3xl font-bold text-center">O que oferecemos</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Calendar className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Gestão de Eventos</h3>
                <p className="text-gray-600">
                  Crie, organize e gerencie seus eventos de forma simples e intuitiva com nosso sistema completo.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <MessageCircle className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Chat Integrado</h3>
                <p className="text-gray-600">
                  Comunique-se diretamente com prestadores, contratantes ou anunciantes através de nossa plataforma.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Users className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Conexões Relevantes</h3>
                <p className="text-gray-600">
                  Conecte-se aos melhores prestadores de serviços especializados para seu tipo de evento.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Building className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Espaços para Eventos</h3>
                <p className="text-gray-600">
                  Encontre ou anuncie os melhores locais para realizar eventos de todos os tipos e tamanhos.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <MapPin className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Localização Inteligente</h3>
                <p className="text-gray-600">
                  Encontre profissionais e espaços próximos ao local do seu evento, economizando em logística.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Award className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Profissionais Verificados</h3>
                <p className="text-gray-600">
                  Todos os prestadores de serviço e espaços passam por verificação e são avaliados por outros usuários.
                </p>
              </div>
            </div>
          </div>
          
          {/* Team Section */}
          <div className="space-y-10">
            <h2 className="text-3xl font-bold text-center">Nosso Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Lucas Pereira", role: "CEO & Fundador", initials: "LP" },
                { name: "Mariana Costa", role: "CTO", initials: "MC" },
                { name: "Rafael Santos", role: "Head de Operações", initials: "RS" }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-gray-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl py-12 px-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para transformar seus eventos?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de contratantes, prestadores de serviço e anunciantes que estão revolucionando o mercado de eventos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Criar uma conta
              </Link>
              <Link to="/service-providers" className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
                Explorar serviços
              </Link>
              <Link to="/venues" className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/80 transition-colors">
                Ver espaços
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
