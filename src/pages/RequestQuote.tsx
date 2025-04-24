
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";

const RequestQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock provider data based on ID
  const provider = {
    id,
    name: 'Ana Fotografia',
    services: ['Fotografia', 'Filmagem'],
    image: '/placeholder.svg',
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Orçamento enviado!",
        description: `Seu pedido de orçamento foi enviado para ${provider.name}. Você receberá uma resposta em breve.`,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto py-12 px-4 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Solicitar Orçamento</h1>
          <p className="text-gray-600 mb-8">
            Preencha o formulário abaixo para enviar um pedido de orçamento para {provider.name}.
          </p>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img 
                        src={provider.image} 
                        alt={provider.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {provider.services.map((service, index) => (
                          <span 
                            key={index}
                            className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-muted pt-4 text-sm text-gray-700">
                    <p className="mb-4">
                      Ao solicitar um orçamento, você receberá uma proposta personalizada baseada nas informações fornecidas.
                    </p>
                    <p>
                      O prestador entrará em contato com você para mais detalhes, se necessário.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Evento</CardTitle>
                  <CardDescription>
                    Forneça detalhes do seu evento para um orçamento mais preciso
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="eventType" className="label">Tipo de evento *</label>
                      <select 
                        id="eventType" 
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="input"
                        required
                      >
                        <option value="" disabled>Selecione o tipo de evento</option>
                        <option value="wedding">Casamento</option>
                        <option value="birthday">Aniversário</option>
                        <option value="corporate">Evento corporativo</option>
                        <option value="graduation">Formatura</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="eventDate" className="label">Data do evento *</label>
                      <input 
                        id="eventDate" 
                        type="date" 
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="label">Local/Cidade do evento *</label>
                      <input 
                        id="location" 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="input"
                        placeholder="Ex: São Paulo, SP"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="guests" className="label">Número aproximado de convidados *</label>
                      <input 
                        id="guests" 
                        type="number" 
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="input"
                        placeholder="Ex: 100"
                        required
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="label">Mensagem adicional</label>
                      <textarea 
                        id="message" 
                        rows={4} 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="input"
                        placeholder="Descreva detalhes adicionais sobre o evento e suas necessidades específicas..."
                      ></textarea>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full bg-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Enviando...' : 'Enviar pedido de orçamento'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RequestQuote;
