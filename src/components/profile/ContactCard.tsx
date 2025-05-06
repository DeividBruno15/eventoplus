
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Mail, Phone, Edit } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface ContactCardProps {
  userData: UserProfile;
  onEditAddress: () => void;
}

export const ContactCard = ({ userData, onEditAddress }: ContactCardProps) => {
  // Format full address from all address components
  const formatFullAddress = () => {
    const components = [];
    
    if (userData.street) components.push(userData.street);
    if (userData.number) components.push(`nº ${userData.number}`);
    if (userData.neighborhood) components.push(`- ${userData.neighborhood}`);
    if (userData.city) components.push(`- ${userData.city}`);
    if (userData.state) components.push(`/ ${userData.state}`);
    
    return components.length > 0 ? components.join(' ') : "Endereço não cadastrado";
  };

  return (
    <Card className="bg-white shadow-sm border overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-700">E-mail</h4>
              <p className="text-sm">{userData.email || "Não informado"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-700">Telefone</h4>
              <p className="text-sm">{userData.phone_number || "Não informado"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-700">Endereço</h4>
              <p className="text-sm">{formatFullAddress()}</p>
              {userData.zipcode && (
                <p className="text-xs text-muted-foreground mt-1">
                  CEP: {userData.zipcode}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t p-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2" 
          onClick={onEditAddress}
        >
          <Edit className="h-4 w-4" />
          Atualizar endereço
        </Button>
      </div>
    </Card>
  );
};
