
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para simplificar o planejamento do seu evento?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Cadastre-se gratuitamente e comece a conectar-se com os melhores profissionais para o seu evento.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register?type=contratante">
              <Button className="bg-white text-primary hover:bg-white/90 px-6 py-6 text-base">
                Cadastrar como Contratante
              </Button>
            </Link>
            <Link to="/register?type=prestador">
              <Button className="bg-secondary text-black hover:bg-secondary/90 px-6 py-6 text-base">
                Cadastrar como Prestador
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
