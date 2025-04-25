
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarDays } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "Como funciona a plataforma?",
      answer: "A Evento+ conecta pessoas que estão organizando eventos com prestadores de serviços qualificados. Você pode buscar prestadores por categoria, comparar avaliações e solicitar orçamentos diretamente pela plataforma."
    },
    {
      question: "Quais são os benefícios de usar a Evento+?",
      answer: "A Evento+ oferece uma maneira simplificada de encontrar e contratar prestadores de serviços para eventos. Economize tempo com nossa busca centralizada, compare prestadores com base em avaliações reais e gerencie todos os seus eventos em um só lugar."
    },
    {
      question: "Como me torno um prestador de serviços?",
      answer: "Para se tornar um prestador de serviços, basta criar uma conta na plataforma como prestador, preencher seu perfil com informações detalhadas sobre seus serviços, experiência e portfólio. Após a aprovação, seu perfil estará disponível para potenciais clientes."
    },
    {
      question: "A plataforma cobra alguma taxa?",
      answer: "A Evento+ oferece planos gratuitos e pagos tanto para contratantes quanto para prestadores de serviços. Os planos pagos oferecem recursos adicionais e benefícios exclusivos para melhorar sua experiência na plataforma."
    },
    {
      question: "Como são feitos os pagamentos?",
      answer: "Os pagamentos são negociados diretamente entre o contratante e o prestador de serviços. A Evento+ facilita o contato e a comunicação, mas não intermedia pagamentos no momento."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <CalendarDays className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
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
