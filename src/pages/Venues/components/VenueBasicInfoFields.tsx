
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const venueTypes = [
  { value: "party_hall", label: "Salão de festas" },
  { value: "concert_hall", label: "Casa de shows" },
  { value: "outdoor_space", label: "Espaço aberto" },
  { value: "auditorium", label: "Auditório" },
  { value: "wedding_venue", label: "Espaço para casamentos" },
  { value: "conference_room", label: "Sala de conferências" },
];

const VenueBasicInfoFields = () => {
  const form = useFormContext();
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do anúncio</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título do anúncio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="venue_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de espaço</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de espaço" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {venueTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva seu espaço em detalhes" 
                className="min-h-32"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="max_capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidade máxima</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 100" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price_per_day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço por dia (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 1500" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default VenueBasicInfoFields;
