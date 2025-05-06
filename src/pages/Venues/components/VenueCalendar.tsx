
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface VenueCalendarProps {
  venueId: string;
  venueName: string;
  availableDates?: string[];
}

const VenueCalendar: React.FC<VenueCalendarProps> = ({
  venueId,
  venueName,
  availableDates = []
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Converter as datas disponíveis de strings para objetos Date
  const parsedAvailableDates = availableDates.map(dateString => new Date(dateString));

  // Verificar se uma data está disponível
  const isDateAvailable = (date: Date) => {
    // Se não houver datas específicas, todas estão disponíveis
    if (parsedAvailableDates.length === 0) return true;
    
    return parsedAvailableDates.some(availableDate => 
      availableDate.getDate() === date.getDate() && 
      availableDate.getMonth() === date.getMonth() && 
      availableDate.getFullYear() === date.getFullYear()
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    if (!isDateAvailable(date)) return;
    
    setSelectedDate(date);
    
    // Se o usuário estiver logado, abrir o diálogo de contato
    if (user) {
      setContactName(`${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`);
      setContactEmail(user.email || '');
      setIsDialogOpen(true);
    } else {
      // Se não estiver logado, mostrar mensagem sugerindo login
      toast.error("É necessário estar logado para solicitar reservas.");
    }
  };

  const handleContactSubmit = async () => {
    if (!contactName || !contactEmail || !contactPhone) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulação de envio - em um app real, isso seria uma API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsDialogOpen(false);
      setSelectedDate(undefined);
      
      toast.success("Solicitação de reserva enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4">Disponibilidade</h3>
      
      <div className="flex flex-col items-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={[
            { before: new Date() },  // Desabilitar datas passadas
            (date) => !isDateAvailable(date), // Desabilitar datas não disponíveis
          ]}
          locale={ptBR}
          className="rounded-md border shadow"
        />
        
        <div className="mt-4 text-center w-full">
          <p className="text-sm text-gray-500 mb-2">
            Selecione uma data disponível para solicitar reserva
          </p>
          
          {parsedAvailableDates.length === 0 ? (
            <p className="text-xs text-green-600 font-medium">
              Todas as datas futuras estão disponíveis para consulta
            </p>
          ) : (
            <p className="text-xs text-blue-600 font-medium">
              As datas disponíveis estão destacadas no calendário
            </p>
          )}
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Solicitar reserva</DialogTitle>
            <DialogDescription>
              Preencha seus dados para solicitar a reserva de {venueName} para o dia{' '}
              {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleContactSubmit}
              disabled={!contactName || !contactEmail || !contactPhone || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VenueCalendar;
