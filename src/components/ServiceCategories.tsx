import { Camera, Music, Utensils, Car, Palette, Users, Mic, Gift, MapPin } from 'lucide-react';

const ServiceCategories = () => {
  const categories = [
    { icon: Camera, title: "Fotografia", description: "Fotógrafos profissionais" },
    { icon: Music, title: "Música e DJ", description: "DJs e bandas" },
    { icon: Utensils, title: "Catering", description: "Serviços de alimentação" },
    { icon: Car, title: "Transporte", description: "Locação de veículos" },
    { icon: Palette, title: "Decoração", description: "Decoradores e floristas" },
    { icon: Users, title: "Animação", description: "Animadores e recreação" },
    { icon: Mic, title: "Som e Luz", description: "Equipamentos audiovisuais" },
    { icon: Gift, title: "Cerimonial", description: "Mestres de cerimônia" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            NOSSOS SERVIÇOS
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">Tudo para seu evento perfeito</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Encontre os melhores profissionais para cada aspecto do seu evento. 
            Todos verificados e avaliados pela nossa comunidade.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-xl font-semibold mb-8 text-center text-gray-800">Serviços para eventos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{category.title}</h4>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-8 text-gray-800">Espaços para eventos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Salões de festa", description: "Para celebrações" },
              { title: "Espaços corporativos", description: "Eventos empresariais" },
              { title: "Locais ao ar livre", description: "Jardins e pátios" },
              { title: "Casas de eventos", description: "Locais especializados" }
            ].map((space, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{space.title}</h4>
                <p className="text-sm text-gray-600">{space.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
