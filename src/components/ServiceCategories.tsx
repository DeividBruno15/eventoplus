
import { Link } from 'react-router-dom';

const ServiceCategories = () => {
  const categories = [
    {
      name: 'Buffet',
      icon: '🍽️',
      description: 'Alimentação para seu evento',
      link: '/service-providers?category=buffet'
    },
    {
      name: 'DJ',
      icon: '🎵',
      description: 'Música e entretenimento',
      link: '/service-providers?category=dj'
    },
    {
      name: 'Fotografia',
      icon: '📷',
      description: 'Registros profissionais',
      link: '/service-providers?category=fotografia'
    },
    {
      name: 'Decoração',
      icon: '🎨',
      description: 'Ambientação de espaços',
      link: '/service-providers?category=decoracao'
    },
    {
      name: 'Iluminação',
      icon: '💡',
      description: 'Efeitos de luz',
      link: '/service-providers?category=iluminacao'
    },
    {
      name: 'Segurança',
      icon: '🛡️',
      description: 'Segurança para eventos',
      link: '/service-providers?category=seguranca'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Categorias de serviços</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontre prestadores especializados em diversas áreas para tornar seu evento perfeito.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link to={category.link} key={index}>
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md border border-muted transition-all hover:-translate-y-1 text-center h-full flex flex-col justify-between">
                <div>
                  <span className="text-4xl mb-4 inline-block">{category.icon}</span>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <div className="mt-6">
                  <span className="text-primary font-medium inline-flex items-center">
                    Ver prestadores
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
