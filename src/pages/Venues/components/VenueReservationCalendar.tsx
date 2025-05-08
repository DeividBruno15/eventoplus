
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVenueReservations } from "../hooks/useVenueReservations";
import { CheckCircle2, XCircle } from "lucide-react";

interface VenueReservationCalendarProps {
  venueId: string;
  onSelectionChange: (dates: Date[]) => void;
  isOwner?: boolean;
}

const VenueReservationCalendar: React.FC<VenueReservationCalendarProps> = ({
  venueId,
  onSelectionChange,
  isOwner = false
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const { bookedDates, isLoading, fetchReservations, isDateAvailable } = useVenueReservations(venueId);
  
  // Carregar reservas ao inicializar o componente
  useEffect(() => {
    if (venueId) {
      fetchReservations();
    }
  }, [venueId]);

  // Função para formatar datas
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Determinar se uma data pode ser selecionada
  const isDaySelectable = (date: Date): boolean => {
    // Datas passadas não podem ser selecionadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return false;
    
    // Se for o proprietário, todas as datas futuras são selecionáveis
    if (isOwner) return true;
    
    // Para visitantes, verificar disponibilidade
    return isDateAvailable(date);
  };
  
  // Lidar com seleção de data
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Verificar se a data já está selecionada
    const dateIndex = selectedDates.findIndex(selectedDate => 
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getDate() === date.getDate()
    );
    
    let newSelectedDates;
    if (dateIndex >= 0) {
      // Remover da seleção
      newSelectedDates = [
        ...selectedDates.slice(0, dateIndex),
        ...selectedDates.slice(dateIndex + 1)
      ];
    } else {
      // Adicionar à seleção apenas se estiver disponível
      if (isDaySelectable(date)) {
        newSelectedDates = [...selectedDates, date];
      } else {
        return; // Data não disponível, não fazer nada
      }
    }
    
    setSelectedDates(newSelectedDates);
    onSelectionChange(newSelectedDates);
  };
  
  // Limpar seleção
  const clearSelection = () => {
    setSelectedDates([]);
    onSelectionChange([]);
  };

  // Função para renderizar conteúdo personalizado nos dias do calendário
  const dayRender = (date: Date) => {
    const isBooked = bookedDates.some(bookedDate => 
      bookedDate.getFullYear() === date.getFullYear() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getDate() === date.getDate()
    );
    
    const isSelected = selectedDates.some(selectedDate => 
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getDate() === date.getDate()
    );
    
    return (
      <div className="relative w-full h-full">
        {isBooked && (
          <div className="absolute -top-0.5 -right-0.5">
            <XCircle className="h-3 w-3 text-destructive" />
          </div>
        )}
        {isSelected && (
          <div className="absolute -top-0.5 -right-0.5">
            <CheckCircle2 className="h-3 w-3 text-primary" />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Selecione as datas</h3>
        {selectedDates.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearSelection}>
            Limpar seleção
          </Button>
        )}
      </div>
      
      <Calendar
        mode="multiple"
        selected={selectedDates}
        onSelect={handleSelect}
        disabled={(date) => !isDaySelectable(date)}
        className="rounded-md border"
        components={{
          DayContent: ({ date }) => dayRender(date)
        }}
      />
      
      {isLoading ? (
        <div className="text-sm text-muted-foreground text-center">
          Carregando disponibilidade...
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="h-2 w-2 rounded-full bg-destructive" />
              <span>Reservado</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="h-2 w-2 rounded-full bg-primary" />
              <span>Selecionado</span>
            </div>
          </div>
          
          {selectedDates.length > 0 && (
            <div className="text-sm">
              <p className="font-medium">Datas selecionadas:</p>
              <ul className="mt-1 space-y-1">
                {selectedDates
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map((date, index) => (
                    <li key={index} className="text-xs">
                      {formatDate(date)}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VenueReservationCalendar;
