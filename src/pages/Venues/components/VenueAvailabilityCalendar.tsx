
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface VenueAvailabilityCalendarProps {
  selectedDates: Date[];
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
}

const VenueAvailabilityCalendar: React.FC<VenueAvailabilityCalendarProps> = ({ 
  selectedDates, 
  setSelectedDates 
}) => {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-base font-medium">Disponibilidade</h3>
        <p className="text-sm text-muted-foreground">
          Selecione os dias em que seu espaço está disponível para locação
        </p>
      </div>
      
      <div className="border rounded-md p-4">
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={(dates) => setSelectedDates(dates || [])}
          className="pointer-events-auto mx-auto"
          locale={ptBR}
          disabled={(date) => date < new Date()}
        />
        
        <p className="text-sm text-muted-foreground mt-2">
          {selectedDates.length} dias selecionados
        </p>
      </div>
    </div>
  );
};

export default VenueAvailabilityCalendar;
