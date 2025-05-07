
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container max-w-4xl mx-auto py-16 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Termos de Serviço</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p className="mb-4">
            Ao acessar ou usar nossos serviços, você concorda em cumprir e estar vinculado a estes Termos de Serviço. 
            Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Modificações nos Termos</h2>
          <p className="mb-4">
            Reservamos o direito de modificar estes termos a qualquer momento. As modificações entram em vigor 
            imediatamente após a publicação. O uso contínuo de nossos serviços após tais modificações constitui 
            sua aceitação dos novos termos.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Uso do Serviço</h2>
          <p className="mb-4">
            Nossos serviços são destinados apenas para uso legal. Você concorda em não usar nossos serviços para 
            qualquer finalidade ilegal ou proibida por estes termos.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Contas de Usuário</h2>
          <p className="mb-4">
            Quando você cria uma conta conosco, você é responsável por manter a segurança de sua conta e é totalmente 
            responsável por todas as atividades que ocorrem sob sua conta.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitação de Responsabilidade</h2>
          <p className="mb-4">
            Em nenhum caso seremos responsáveis por quaisquer danos diretos, indiretos, incidentais, consequenciais, 
            especiais ou punitivos decorrentes do uso de nossos serviços.
          </p>
          
          <div className="mt-8">
            <Link to="/privacy" className="text-primary hover:underline">Ver nossa Política de Privacidade</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
