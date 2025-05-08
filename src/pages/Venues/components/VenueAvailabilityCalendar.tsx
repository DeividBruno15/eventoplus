
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface VenueAvailabilityCalendarProps {
  selectedDates: Date[];
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
  readOnly?: boolean;
}

const VenueAvailabilityCalendar: React.FC<VenueAvailabilityCalendarProps> = ({ 
  selectedDates, 
  setSelectedDates,
  readOnly = false
}) => {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-base font-medium">{readOnly ? 'Disponibilidade' : 'Selecione as datas'}</h3>
        <p className="text-sm text-muted-foreground">
          {readOnly 
            ? 'Estas são as datas disponíveis para seu espaço' 
            : 'Selecione os dias que deseja reservar'}
        </p>
      </div>
      
      <div className="border rounded-md p-4 bg-white shadow-sm">
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={!readOnly ? ((dates) => setSelectedDates(dates || [])) : undefined}
          className={`pointer-events-auto mx-auto ${readOnly ? 'pointer-events-none' : ''}`}
          locale={ptBR}
          disabled={(date) => date < new Date()}
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            day_today: "bg-muted text-foreground font-bold",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-30",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted rounded-md",
            caption: "flex justify-center pt-1 relative items-center text-primary",
            caption_label: "text-sm font-medium text-foreground",
            nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-muted rounded-md text-primary",
            table: "w-full border-collapse space-y-1 mt-2",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          }}
        />
        
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary"></span>
            <span>{readOnly ? 'Dias disponíveis' : 'Dias selecionados'}</span>
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
