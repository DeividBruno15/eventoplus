
import { useState } from 'react';

const TestimonialSection = () => {
  const testimonials = [
    {
      name: 'Amanda Silva',
      role: 'Noiva',
      quote: 'O Evento+ transformou o planejamento do meu casamento. Encontrei fornecedores incríveis que atenderam todas as minhas expectativas.',
      avatar: '/placeholder.svg'
    },
    {
      name: 'Carlos Mendes',
      role: 'Gestor de Eventos Corporativos',
      quote: 'A plataforma simplificou muito nosso processo de contratação para eventos empresariais. Conseguimos fornecedores qualificados rapidamente.',
      avatar: '/placeholder.svg'
    },
    {
      name: 'Luciana Santos',
      role: 'Fotógrafa',
      quote: 'Como prestadora de serviços, o Evento+ aumentou significativamente minha visibilidade. Consegui muitos novos clientes através da plataforma.',
      avatar: '/placeholder.svg'
    }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">O que dizem sobre nós</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Veja os depoimentos de clientes e prestadores que já utilizam a plataforma Evento+.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-muted relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/4 flex-shrink-0">
              <img 
                src={testimonials[activeTestimonial].avatar} 
                alt={testimonials[activeTestimonial].name} 
                className="rounded-full w-24 h-24 object-cover mx-auto"
              />
            </div>
            <div className="md:w-3/4">
              <blockquote>
                <p className="text-lg mb-4 italic text-gray-700">"{testimonials[activeTestimonial].quote}"</p>
                <footer>
                  <p className="font-semibold">{testimonials[activeTestimonial].name}</p>
                  <p className="text-gray-600 text-sm">{testimonials[activeTestimonial].role}</p>
                </footer>
              </blockquote>
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full ${
                  index === activeTestimonial ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Depoimento ${index + 1}`}
              />
            ))}
          </div>

          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
            <button
              onClick={prevTestimonial}
              className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-primary transition-colors"
              aria-label="Depoimento anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-primary transition-colors"
              aria-label="Próximo depoimento"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
