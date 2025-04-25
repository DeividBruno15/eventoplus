
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  LifeBuoy, 
  MessageCircle,
  Phone,
  Mail,
  Send,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Support = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: session?.user?.user_metadata?.first_name ? 
      `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name || ''}` : '',
    email: session?.user?.email || '',
    subject: '',
    category: '',
    message: ''
  });

  if (!session) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.subject || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Mensagem enviada",
        description: "Sua solicitação foi enviada com sucesso. Entraremos em contato em breve.",
      });
      
      setFormData(prev => ({
        ...prev,
        subject: '',
        category: '',
        message: ''
      }));
      
      setIsSubmitting(false);
    }, 1500);
  };

  const supportCategories = [
    { value: "account", label: "Conta e Acesso" },
    { value: "billing", label: "Cobrança e Pagamentos" },
    { value: "events", label: "Eventos" },
    { value: "technical", label: "Problemas Técnicos" },
    { value: "feedback", label: "Sugestões e Feedback" },
    { value: "other", label: "Outros" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Suporte</h2>
        <p className="text-muted-foreground mt-2">
          Entre em contato com nossa equipe para obter ajuda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Enviar mensagem
            </CardTitle>
            <CardDescription>
              Preencha o formulário abaixo e responderemos o mais breve possível
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <Select value={formData.category} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categorias</SelectLabel>
                      {supportCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Assunto <span className="text-red-500">*</span>
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Resumo da sua solicitação"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensagem <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Descreva detalhadamente sua solicitação..."
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> 
                    Enviar mensagem
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5" />
              Informações de contato
            </CardTitle>
            <CardDescription>
              Outras formas de entrar em contato conosco
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">Resposta em até 24h</p>
                  <a href="mailto:suporte@exemplo.com.br" className="text-sm text-primary hover:underline">
                    suporte@exemplo.com.br
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Telefone</h3>
                  <p className="text-sm text-muted-foreground">Seg-Sex, 9h às 18h</p>
                  <a href="tel:+551139876543" className="text-sm text-primary hover:underline">
                    (11) 3987-6543
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Chat ao vivo</h3>
                  <p className="text-sm text-muted-foreground">Disponível nos dias úteis</p>
                  <Button variant="link" className="h-auto p-0 text-sm">
                    Iniciar conversa
                  </Button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-2">Horário de atendimento</h4>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-1">Segunda-Sexta:</td>
                    <td>9h às 18h</td>
                  </tr>
                  <tr>
                    <td className="py-1">Sábado:</td>
                    <td>10h às 14h</td>
                  </tr>
                  <tr>
                    <td className="py-1">Domingo:</td>
                    <td>Fechado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
