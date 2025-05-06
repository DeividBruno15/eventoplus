
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { consultarCep, formatCep } from "@/utils/cep";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const venueSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  zipcode: z.string().min(8, "CEP inválido"),
  street: z.string().min(3, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 letras"),
});

type VenueFormValues = z.infer<typeof venueSchema>;

interface VenueFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function VenueForm({ onSuccess, onCancel }: VenueFormProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      zipcode: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });
  
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value);
    form.setValue("zipcode", formattedCep);
    
    if (formattedCep.length === 9) {
      const address = await consultarCep(formattedCep);
      
      if (address) {
        form.setValue("street", address.street);
        form.setValue("neighborhood", address.neighborhood);
        form.setValue("city", address.city);
        form.setValue("state", address.state);
      }
    }
  };

  const onSubmit = async (values: VenueFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para cadastrar um local");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("user_venues").insert({
        user_id: user.id,
        name: values.name,
        zipcode: values.zipcode.replace("-", ""),
        street: values.street,
        number: values.number,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
      });

      if (error) throw error;
      
      toast.success("Local cadastrado com sucesso!");
      onSuccess();
    } catch (error: any) {
      console.error("Error creating venue:", error);
      toast.error("Erro ao cadastrar local");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do local</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Salão de Festas ABC" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input 
                  placeholder="00000-000" 
                  {...field} 
                  onChange={handleCepChange}
                  maxLength={9}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua</FormLabel>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder="Rua exemplo" 
                        {...field} 
                      />
                    </FormControl>
                  </div>
                  <div className="w-24">
                    <FormControl>
                      <Input 
                        placeholder="Nº" 
                        {...form.register("number")} 
                      />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem className="sr-only">
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Bairro" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Cidade" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="UF" 
                    maxLength={2} 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value.toUpperCase());
                    }} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={submitting}
          >
            {submitting ? 'Salvando...' : 'Salvar Local'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
