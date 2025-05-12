
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Calendar, Briefcase, Building, Megaphone, UserSearch } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { OnboardingFunctionsData, onboardingFunctionsSchema } from '@/pages/Onboarding/types';
import { useOnboardingFunctions } from '@/hooks/useOnboardingFunctions';
import { useToast } from '@/hooks/use-toast';

interface UserFunctionsFormProps {
  userData: any;
  onSuccess?: () => void;
}

export function UserFunctionsForm({ userData, onSuccess }: UserFunctionsFormProps) {
  const [saving, setSaving] = useState(false);
  const { saveUserFunctions } = useOnboardingFunctions();
  const { toast } = useToast();
  
  const form = useForm<OnboardingFunctionsData>({
    resolver: zodResolver(onboardingFunctionsSchema),
    defaultValues: {
      is_contratante: userData?.is_contratante || false,
      is_prestador: userData?.is_prestador || false,
      candidata_eventos: userData?.candidata_eventos || false,
      divulga_servicos: userData?.divulga_servicos || false,
      divulga_eventos: userData?.divulga_eventos || false,
      divulga_locais: userData?.divulga_locais || false,
      phone_number: userData?.phone_number || '',
      accept_whatsapp: userData?.whatsapp_opt_in || false,
      accept_terms: true,
    }
  });
  
  const handleSubmit = async (data: OnboardingFunctionsData) => {
    try {
      setSaving(true);
      await saveUserFunctions(data);
      
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências de uso da plataforma foram atualizadas com sucesso"
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar configurações",
        description: error.message || "Ocorreu um erro ao salvar suas preferências",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const { is_prestador } = form.watch();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Como você usa a plataforma</CardTitle>
        <CardDescription>
          Ajuste como você deseja utilizar a plataforma e quais funções deseja ativar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Principais funções</h3>
              
              <FormField
                control={form.control}
                name="is_contratante"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div className="space-y-0.5">
                        <p className="font-medium">Divulgar eventos e contratar prestadores</p>
                        <p className="text-sm text-muted-foreground">
                          Crie eventos e encontre profissionais qualificados
                        </p>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_prestador"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <div className="space-y-0.5">
                        <p className="font-medium">Oferecer meus serviços em eventos</p>
                        <p className="text-sm text-muted-foreground">
                          Seja encontrado por pessoas que buscam seus serviços
                        </p>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="divulga_locais"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-primary" />
                      <div className="space-y-0.5">
                        <p className="font-medium">Anunciar locais de eventos</p>
                        <p className="text-sm text-muted-foreground">
                          Divulgue seus espaços para pessoas que procuram onde realizar eventos
                        </p>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {is_prestador && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Opções de prestador</h3>
                
                <FormField
                  control={form.control}
                  name="candidata_eventos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-3">
                        <UserSearch className="h-5 w-5 text-primary" />
                        <div className="space-y-0.5">
                          <p className="font-medium">Me candidatar a eventos existentes</p>
                          <p className="text-sm text-muted-foreground">
                            Busque e se candidate a eventos publicados na plataforma
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="divulga_servicos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-3">
                        <Megaphone className="h-5 w-5 text-primary" />
                        <div className="space-y-0.5">
                          <p className="font-medium">Divulgar meus serviços</p>
                          <p className="text-sm text-muted-foreground">
                            Crie um perfil destacando seus serviços para ser encontrado
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <div className="pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar preferências"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
