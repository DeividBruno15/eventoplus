
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "@/contexts/SessionContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user } = useAuth();
  const { session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Dados do usuário
  const userData = user?.user_metadata;
  const firstName = userData?.first_name || '';
  const lastName = userData?.last_name || '';
  const role = userData?.role === 'contractor' ? 'Contratante' : 'Prestador de Serviços';
  const personType = userData?.person_type === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica';
  const documentNumber = userData?.document_number || '';
  const phone = userData?.phone_number || '';
  const street = userData?.street || '';
  const neighborhood = userData?.neighborhood || '';
  const city = userData?.city || '';
  const state = userData?.state || '';
  const zipcode = userData?.zipcode || '';

  // Função para obter as iniciais do nome do usuário
  const getUserInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const InfoField = ({ label, value }: { label: string; value: string }) => (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-1 text-sm">{value || 'Não informado'}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          {userData?.role === 'provider' && (
            <TabsTrigger value="services">Serviços</TabsTrigger>
          )}
        </TabsList>

        {/* Aba de informações pessoais */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24 bg-primary text-primary-foreground text-3xl">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{firstName} {lastName}</CardTitle>
                  <CardDescription>{role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Nome" value={`${firstName} ${lastName}`} />
                <InfoField label="E-mail" value={user?.email || ''} />
                <InfoField label="Tipo de Pessoa" value={personType} />
                <InfoField label="CPF/CNPJ" value={documentNumber} />
                <InfoField label="Telefone" value={phone} />
                <InfoField label="Função" value={role} />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="mr-2">Editar Perfil</Button>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de endereço */}
        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Seu endereço registrado na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Rua" value={street} />
                <InfoField label="Bairro" value={neighborhood} />
                <InfoField label="Cidade" value={city} />
                <InfoField label="Estado" value={state} />
                <InfoField label="CEP" value={zipcode} />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Atualizar Endereço</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de serviços (apenas para prestadores) */}
        {userData?.role === 'provider' && (
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Serviços Oferecidos</CardTitle>
                <CardDescription>Gerencie os serviços que você oferece na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(userData?.service_categories || []).length > 0 ? (
                    (userData?.service_categories || []).map((category: string, index: number) => (
                      <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                        <span>{category}</span>
                        <Button variant="destructive" size="sm">Remover</Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Nenhum serviço cadastrado</p>
                      <Button className="mt-2">Adicionar Serviço</Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button>Adicionar Novo Serviço</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;
