
import { useFormContext } from "react-hook-form";
import { VenueFormValues } from "./VenueFormSchema";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Venue types options
const VENUE_TYPES = [
  { id: "party_hall", label: "Salão de Festas" },
  { id: "wedding_venue", label: "Espaço para Casamentos" },
  { id: "corporate_space", label: "Espaço Corporativo" },
  { id: "studio", label: "Estúdio" },
  { id: "restaurant", label: "Restaurante" },
  { id: "beach_club", label: "Beach Club" },
  { id: "farm", label: "Fazenda/Sítio" },
  { id: "mansion", label: "Casa/Mansão" },
  { id: "sports_venue", label: "Espaço Esportivo" },
  { id: "garden", label: "Jardim/Área Externa" },
  { id: "other", label: "Outro" },
];

const VenueBasicInfoFields = () => {
  const { control } = useFormContext<VenueFormValues>();
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium">Informações Básicas</h3>
        <p className="text-sm text-muted-foreground">
          Descreva seu espaço e suas características principais
        </p>
      </div>
      
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título do anúncio</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Elegante Salão para Eventos" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva as características do seu espaço..." 
                className="min-h-32 resize-none"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="venue_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Espaço</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {VENUE_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="max_capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidade máxima</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="1"
                  placeholder="Ex: 100 pessoas" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="price_per_day"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço do aluguel (por dia)</FormLabel>
            <FormControl>
              <div className="flex relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00" 
                  className="pl-10"
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VenueBasicInfoFields;
