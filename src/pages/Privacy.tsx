
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container max-w-4xl mx-auto py-16 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            Esta Política de Privacidade descreve como coletamos, usamos e compartilhamos suas informações 
            quando você usa nossos serviços.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Informações que Coletamos</h2>
          <p className="mb-4">
            Coletamos informações que você nos fornece diretamente, como quando você cria uma conta, 
            preenche um formulário, faz uma transação ou se comunica conosco.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Como Usamos Suas Informações</h2>
          <p className="mb-4">
            Usamos as informações que coletamos para operar, manter e fornecer os recursos de nossos serviços, 
            personalizar sua experiência e comunicar-nos com você sobre nossos serviços.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Compartilhamento de Informações</h2>
          <p className="mb-4">
            Não vendemos suas informações pessoais. Podemos compartilhar suas informações com terceiros 
            apenas nas circunstâncias limitadas descritas nesta política.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Segurança</h2>
          <p className="mb-4">
            Tomamos medidas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Seus Direitos</h2>
          <p className="mb-4">
            Dependendo de sua localização, você pode ter certos direitos em relação às suas informações pessoais, 
            incluindo o direito de acessar, corrigir ou excluir suas informações.
          </p>
          
          <div className="mt-8">
            <Link to="/terms" className="text-primary hover:underline">Ver nossos Termos de Serviço</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
