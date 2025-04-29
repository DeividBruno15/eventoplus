
import { ContactForm } from "./components/ContactForm";
import { ContactInfo } from "./components/ContactInfo";

const Support = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Suporte</h2>
        <p className="text-muted-foreground mt-2">
          Entre em contato com nossa equipe para obter ajuda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  );
};

export default Support;
