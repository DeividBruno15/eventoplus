
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface ContactCardProps {
  userData: UserProfile;
  onEditAddress: () => void;
}

export const ContactCard = ({ userData, onEditAddress }: ContactCardProps) => {
  const formatAddress = () => {
    const parts = [];
    
    if (userData.street && userData.number) {
      parts.push(`${userData.street}, ${userData.number}`);
    }
    
    if (userData.neighborhood) {
      parts.push(userData.neighborhood);
    }
    
    if (userData.city && userData.state) {
      parts.push(`${userData.city}, ${userData.state}`);
    }
    
    if (userData.zipcode) {
      parts.push(`CEP ${userData.zipcode}`);
    }
    
    return parts.join(" - ");
  };

  const fullAddress = formatAddress();

  const showAddressSection = !!(
    userData.street ||
    userData.city ||
    userData.state ||
    userData.zipcode
  );

  const showContactSection = !!(userData.email || userData.phone_number);

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {showContactSection && (
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Contato</h3>
          <div className="space-y-3">
            {userData.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>{userData.email}</span>
              </div>
            )}
            {userData.phone_number && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>{userData.phone_number}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {showContactSection && showAddressSection && (
        <div className="border-t mx-6"></div>
      )}

      {showAddressSection && (
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Endereço</h3>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <span>{fullAddress}</span>
          </div>
        </div>
      )}

      <div className="border-t px-6 py-4">
        <Button
          onClick={onEditAddress}
          variant="outline"
          className="w-full"
        >
          Atualizar endereço
        </Button>
      </div>
    </div>
  );
};
