
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "Como funciona a plataforma Evento+?",
      answer: "A Evento+ conecta três principais usuários: contratantes que buscam organizar eventos, prestadores de serviços qualificados e anunciantes de espaços para eventos. Nossa plataforma facilita a comunicação, negociação e contratação através de uma interface intuitiva e direta."
    },
    {
      question: "Quais tipos de profissionais posso encontrar?",
      answer: "Nossa plataforma reúne diversos tipos de prestadores de serviços para eventos, incluindo fotógrafos, DJs, buffets, decoradores, cerimonialistas, bartenders, segurança, entre outros. Todos os profissionais passam por uma verificação para garantir a qualidade dos serviços."
    },
    {
      question: "Como faço para anunciar meu espaço para eventos?",
      answer: "Para anunciar seu espaço para eventos, você precisa criar uma conta como anunciante, preencher as informações detalhadas sobre o local, adicionar fotos de qualidade, definir a disponibilidade e os preços. Após a aprovação, seu espaço estará visível para potenciais clientes."
    },
    {
      question: "Como funciona o sistema de comunicação entre contratantes e prestadores?",
      answer: "A Evento+ oferece um sistema de chat integrado que permite comunicação direta entre contratantes e prestadores de serviços. Você pode discutir detalhes do evento, negociar valores e esclarecer dúvidas sem precisar sair da plataforma."
    },
    {
      question: "É possível gerenciar múltiplos eventos na plataforma?",
      answer: "Sim! Contratantes podem gerenciar múltiplos eventos simultaneamente, organizando equipes de prestadores, agendamentos e locais em um painel centralizado. Isso facilita o controle e acompanhamento de cada etapa do planejamento."
    },
    {
      question: "Como são garantidas a qualidade e segurança dos serviços?",
      answer: "A Evento+ implementa um sistema de avaliações e reviews dos prestadores e espaços, permitindo que contratantes anteriores compartilhem suas experiências. Além disso, verificamos as credenciais dos profissionais e incentivamos a transparência na comunicação e negociação."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <HelpCircle className="h-8 w-8 text-primary" />
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Confira as respostas para as dúvidas mais comuns sobre a plataforma Evento+
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
