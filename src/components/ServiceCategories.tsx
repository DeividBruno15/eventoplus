
import { Utensils, Music, Camera, Palette, LampDesk, Shield } from 'lucide-react';

const ServiceCategories = () => {
  const categories = [
    {
      name: 'Buffet',
      icon: <Utensils className="h-16 w-16 text-primary" />,
      description: 'Alimentação para seu evento'
    },
    {
      name: 'DJ',
      icon: <Music className="h-16 w-16 text-primary" />,
      description: 'Música e entretenimento'
    },
    {
      name: 'Fotografia',
      icon: <Camera className="h-16 w-16 text-primary" />,
      description: 'Registros profissionais'
    },
    {
      name: 'Decoração',
      icon: <Palette className="h-16 w-16 text-primary" />,
      description: 'Ambientação de espaços'
    },
    {
      name: 'Iluminação',
      icon: <LampDesk className="h-16 w-16 text-primary" />,
      description: 'Efeitos de luz'
    },
    {
      name: 'Segurança',
      icon: <Shield className="h-16 w-16 text-primary" />,
      description: 'Segurança para eventos'
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
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md border border-muted transition-all hover:-translate-y-1 text-center">
              <div className="flex justify-center mb-4">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
