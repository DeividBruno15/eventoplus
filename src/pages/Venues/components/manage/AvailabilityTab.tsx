
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import VenueReservationCalendar from '../VenueReservationCalendar';

interface AvailabilityTabProps {
  venueId: string;
}

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({ venueId }) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  
  const handleDateSelection = (dates: Date[]) => {
    setSelectedDates(dates);
  };
  
  const handleMarkAsUnavailable = async () => {
    // Aqui implementaríamos a lógica para marcar as datas como indisponíveis
    console.log("Datas marcadas como indisponíveis:", selectedDates);
    // Por enquanto apenas um log, mas aqui faria uma requisição ao backend
    // para atualizar a disponibilidade do local
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Disponibilidade</CardTitle>
        <CardDescription>
          Visualize e gerencie as datas disponíveis para reserva
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <VenueReservationCalendar 
            venueId={venueId}
            onSelectionChange={handleDateSelection}
            isOwner={true}
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Legenda</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Reservado/Indisponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm">Dias selecionados</span>
              </div>
            </div>
          </div>
          
          {selectedDates.length > 0 && (
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">Dias selecionados</h3>
              <div className="max-h-[200px] overflow-y-auto">
                <ul className="space-y-1">
                  {selectedDates
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((date, index) => (
                      <li key={index} className="text-sm flex justify-between">
                        <span>
                          {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleMarkAsUnavailable}
                >
                  Marcar como indisponível
                </Button>
              </div>
            </div>
          )}
          
          <div className="border p-4 rounded-lg">
            <h3 className="font-medium mb-2">Integrações de calendário</h3>
            <p className="text-sm text-muted-foreground">
              Sincronize seu calendário para bloquear datas automaticamente e evitar sobreposições.
            </p>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Conectar ao Google Calendar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityTab;
