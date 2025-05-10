
export const FAQSection = () => {
  return (
    <div className="mt-8 p-4 bg-muted rounded-lg">
      <h3 className="text-lg font-medium mb-2">Perguntas frequentes</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Posso cancelar a qualquer momento?</h4>
          <p className="text-sm text-muted-foreground">
            Sim, você pode cancelar sua assinatura a qualquer momento. O acesso ao plano continua válido até o final do período pago.
          </p>
        </div>
        <div>
          <h4 className="font-medium">Como funciona o processo de pagamento?</h4>
          <p className="text-sm text-muted-foreground">
            Utilizamos o Stripe para pagamentos com cartão de crédito e em breve o Abacate Pay para pagamentos via PIX, garantindo segurança e facilidade.
          </p>
        </div>
      </div>
    </div>
  );
};
