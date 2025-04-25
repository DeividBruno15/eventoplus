
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      
      <main className="container py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Sobre a Evento+</h1>
        
        <div className="max-w-3xl mx-auto space-y-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Nossa Missão</h2>
              <p className="text-gray-700 leading-relaxed">
                A Evento+ nasceu com a missão de simplificar a organização de eventos, conectando contratantes e prestadores de serviços de forma intuitiva e eficiente. 
                Acreditamos que cada evento é único e merece ser realizado com excelência, por isso trabalhamos para criar uma plataforma que atenda às necessidades específicas de cada cliente.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Nossa História</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Fundada em 2023, a Evento+ surgiu da percepção de que organizar eventos, sejam eles corporativos, sociais ou familiares, 
                envolve uma complexa rede de prestadores de serviços e detalhes logísticos que podem ser desafiadores para qualquer pessoa.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Nossa equipe, formada por profissionais experientes no ramo de eventos e tecnologia, uniu forças para criar uma solução 
                que simplifica todo esse processo, permitindo que nossos clientes se concentrem no que realmente importa: aproveitar seus momentos especiais.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Nossos Valores</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 mt-0.5">1</span>
                  <div>
                    <h3 className="font-medium mb-1">Excelência</h3>
                    <p>Buscamos a excelência em tudo o que fazemos, desde o desenvolvimento da plataforma até o atendimento ao cliente.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 mt-0.5">2</span>
                  <div>
                    <h3 className="font-medium mb-1">Confiança</h3>
                    <p>Construímos relações de confiança com nossos usuários, garantindo transparência e segurança em todas as interações.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 mt-0.5">3</span>
                  <div>
                    <h3 className="font-medium mb-1">Inovação</h3>
                    <p>Estamos sempre buscando maneiras inovadoras de melhorar nossa plataforma e oferecer novas soluções para nossos usuários.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white mr-3 mt-0.5">4</span>
                  <div>
                    <h3 className="font-medium mb-1">Comunidade</h3>
                    <p>Valorizamos a comunidade de contratantes e prestadores de serviços que formam nosso ecossistema.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Nossa Equipe</h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                Somos uma equipe diversificada e apaixonada, unida pelo objetivo de revolucionar o mercado de eventos no Brasil. 
                Nossos colaboradores são especialistas em suas áreas e trabalham continuamente para aprimorar a experiência dos usuários na plataforma.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-3 flex items-center justify-center text-gray-500">
                    LP
                  </div>
                  <h3 className="font-medium">Lucas Pereira</h3>
                  <p className="text-sm text-gray-500">CEO & Fundador</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-3 flex items-center justify-center text-gray-500">
                    MC
                  </div>
                  <h3 className="font-medium">Mariana Costa</h3>
                  <p className="text-sm text-gray-500">CTO</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-3 flex items-center justify-center text-gray-500">
                    RS
                  </div>
                  <h3 className="font-medium">Rafael Santos</h3>
                  <p className="text-sm text-gray-500">Head de Operações</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
