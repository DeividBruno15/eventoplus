
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Como funciona a plataforma Evento+?",
      answer: "A Evento+ conecta contratantes, prestadores de serviços e anunciantes de espaços. Contratantes podem buscar e contratar profissionais, prestadores podem oferecer seus serviços, e anunciantes podem divulgar seus espaços para eventos."
    },
    {
      question: "É seguro contratar pela plataforma?",
      answer: "Sim! Todos os prestadores passam por um processo de verificação. Além disso, você pode ver avaliações de outros clientes antes de contratar. Nossa plataforma também oferece suporte durante todo o processo."
    },
    {
      question: "Como são feitos os pagamentos?",
      answer: "Os pagamentos são processados de forma segura através da nossa plataforma. Oferecemos diversas opções de pagamento e garantias tanto para contratantes quanto para prestadores."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento através das configurações da sua conta. Não há multas por cancelamento."
    },
    {
      question: "Como funciona o sistema de avaliações?",
      answer: "Após cada evento, tanto contratantes quanto prestadores podem avaliar uns aos outros. Isso ajuda a manter a qualidade dos serviços e a confiança na plataforma."
    },
    {
      question: "Há suporte ao cliente disponível?",
      answer: "Sim! Oferecemos suporte via chat, email e telefone. Nosso time está sempre pronto para ajudar com qualquer dúvida ou problema que você possa ter."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">Perguntas frequentes</h2>
          <p className="text-lg text-gray-600">
            Encontre respostas para as dúvidas mais comuns sobre nossa plataforma
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-gray-50 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Não encontrou a resposta que procurava?</p>
          <a 
            href="/contact" 
            className="text-primary hover:text-primary/80 font-medium underline"
          >
            Entre em contato conosco
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
