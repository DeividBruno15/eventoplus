
import { Mail, Phone, Globe, Instagram, MessageCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AboutTabProps {
  tagline: string;
  description: string;
}

export const AboutTab = ({ tagline, description }: AboutTabProps) => {
  return (
    <div className="space-y-6">
      {/* Tagline and Description Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-indigo-600 mb-3">{tagline}</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
      
      {/* Contact Information Card */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Informações de contato</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-indigo-500" />
              <span className="text-gray-700">contato@anafotografia.com</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-indigo-500" />
              <span className="text-gray-700">(11) 98765-4321</span>
            </div>
            
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-indigo-500" />
              <span className="text-gray-700">WhatsApp: (11) 98765-4321</span>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-indigo-500" />
              <a 
                href="https://www.anafotografia.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                www.anafotografia.com
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <Instagram className="h-5 w-5 text-indigo-500" />
              <a 
                href="https://www.instagram.com/anafotografiaoficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                @anafotografiaoficial
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Experience and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3 text-indigo-600">Experiência</h3>
            <p className="text-gray-700">
              Com mais de 8 anos de experiência em fotografia para eventos, oferecemos um serviço personalizado 
              que captura todos os momentos especiais do seu evento com qualidade e criatividade.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3 text-indigo-600">Diferenciais</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Entrega de arquivos em alta resolução</li>
              <li>Álbum digital incluído no pacote</li>
              <li>Equipamento profissional de última geração</li>
              <li>Edição premium das fotografias</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Schedule and Availability */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-3 text-indigo-600">Horário de Atendimento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Dias úteis</h4>
              <p className="text-gray-700">09:00 - 18:00</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Fins de semana</h4>
              <p className="text-gray-700">Mediante agendamento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
