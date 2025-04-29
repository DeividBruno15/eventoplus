
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, Phone, MessageCircle } from "lucide-react";

export const ContactInfo = () => {
  return (
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
  );
};
