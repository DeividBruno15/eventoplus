
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
      
      <div className="border rounded-md p-4 bg-white shadow-sm">
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={(dates) => setSelectedDates(dates || [])}
          className="pointer-events-auto mx-auto"
          locale={ptBR}
          disabled={(date) => date < new Date()}
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground font-bold",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-30",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted rounded-md"
          }}
        />
        
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary"></span>
            <span>Dias disponíveis</span>
          </div>
          <p>
            {selectedDates.length} {selectedDates.length === 1 ? 'dia selecionado' : 'dias selecionados'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VenueAvailabilityCalendar;
