
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card } from '@/components/ui/card';
import { CheckCircle, Briefcase, Users, Calendar, Award, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      
      <main className="container py-16">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Conectamos pessoas e serviços
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              A Evento+ é a plataforma que facilita a organização de eventos, conectando 
              contratantes a prestadores de serviços qualificados, economizando tempo e dinheiro.
            </p>
          </div>
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">Nossa Missão</h2>
              <p className="text-gray-700 leading-relaxed">
                Simplificar a organização de eventos através de uma plataforma que conecte 
                contratantes e prestadores de serviços de forma intuitiva e eficiente, 
                garantindo experiências memoráveis.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">Nossa Visão</h2>
              <p className="text-gray-700 leading-relaxed">
                Ser a plataforma líder no mercado de eventos, reconhecida pela excelência, 
                inovação e por transformar a maneira como as pessoas organizam e executam 
                seus eventos em todo o Brasil.
              </p>
            </div>
          </div>
          
          {/* For Whom Section */}
          <div className="space-y-10">
            <h2 className="text-3xl font-bold text-center">Para quem é a Evento+?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Card className="p-8 hover:shadow-md transition-shadow border border-gray-100 bg-gradient-to-br from-indigo-50 to-white">
                <div className="flex flex-col h-full">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <Briefcase className="text-indigo-600 w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">Contratantes</h3>
                  
                  <p className="text-gray-600 mb-6 flex-grow">
                    Pessoas ou empresas que precisam organizar eventos pessoais, corporativos ou 
                    sociais e buscam os melhores profissionais para torná-los realidade.
                  </p>
                  
                  <ul className="space-y-3">
                    {["Publique eventos de qualquer tamanho", "Encontre profissionais qualificados", "Receba orçamentos personalizados", "Acompanhe todo o processo"].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
              
              <Card className="p-8 hover:shadow-md transition-shadow border border-gray-100 bg-gradient-to-br from-green-50 to-white">
                <div className="flex flex-col h-full">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <Users className="text-green-600 w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">Prestadores de Serviços</h3>
                  
                  <p className="text-gray-600 mb-6 flex-grow">
                    Profissionais e empresas especializados em serviços para eventos que 
                    buscam aumentar sua visibilidade, conquistar mais clientes e gerenciar projetos.
                  </p>
                  
                  <ul className="space-y-3">
                    {["Receba solicitações de orçamento", "Expanda sua rede de clientes", "Gerencie seu portfólio", "Construa sua reputação online"].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="space-y-10">
            <h2 className="text-3xl font-bold text-center">O que oferecemos</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Calendar className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Agendamento Simplificado</h3>
                <p className="text-gray-600">
                  Crie eventos, gerencie datas e organize seu cronograma de forma simples e intuitiva.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Users className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Conexões Relevantes</h3>
                <p className="text-gray-600">
                  Conecte-se aos melhores prestadores de serviços para seu tipo de evento.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <MapPin className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Localização Inteligente</h3>
                <p className="text-gray-600">
                  Encontre profissionais próximos ao local do seu evento, economizando em logística.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Award className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Profissionais Verificados</h3>
                <p className="text-gray-600">
                  Todos os prestadores de serviço passam por verificação e são avaliados por outros usuários.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <CheckCircle className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Orçamentos Comparáveis</h3>
                <p className="text-gray-600">
                  Receba e compare diferentes propostas para escolher a que melhor se encaixa na sua necessidade.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Briefcase className="h-10 w-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium mb-3">Gestão Completa</h3>
                <p className="text-gray-600">
                  Acompanhe todo o processo desde o primeiro contato até a conclusão do evento.
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
              Junte-se a milhares de contratantes e prestadores de serviço que estão revolucionando o mercado de eventos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/register" className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Criar uma conta
              </a>
              <a href="/service-providers" className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
                Explorar serviços
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
