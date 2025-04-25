
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import type { CreateEventFormData } from "../schema";

interface BasicEventFieldsProps {
  form: UseFormReturn<CreateEventFormData>;
}

export const BasicEventFields = ({ form }: BasicEventFieldsProps) => {
  const { data: categories, isLoading } = useServiceCategories();
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nome do Evento*</Label>
        <Input
          id="name"
          placeholder="Ex.: Casamento Ana e João"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="event_date">Data do Evento*</Label>
          <Input 
            id="event_date"
            type="date"
            {...form.register('event_date')}
            onChange={(e) => {
              setEventDate(e.target.value);
              form.setValue('event_date', e.target.value);
            }}
          />
          {form.formState.errors.event_date && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.event_date.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="event_time">Horário do Evento*</Label>
          <Input 
            id="event_time"
            type="time"
            {...form.register('event_time')}
            onChange={(e) => {
              setEventTime(e.target.value);
              form.setValue('event_time', e.target.value);
            }}
          />
          {form.formState.errors.event_time && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.event_time.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="service_type">Tipo de Serviço*</Label>
        <Select 
          onValueChange={(value) => form.setValue('service_type', value)}
          value={form.watch('service_type')}
        >
          <SelectTrigger id="service_type">
            <SelectValue placeholder="Selecione o tipo de serviço" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              categories?.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {form.formState.errors.service_type && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.service_type.message}</p>
        )}
      </div>
    </div>
  );
};
