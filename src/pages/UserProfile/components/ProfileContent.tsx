
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Briefcase, CheckSquare } from 'lucide-react';

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  role: 'contractor' | 'provider';
  avatar_url: string | null;
  bio: string | null;
  city?: string;
  state?: string;
  companies?: Array<{
    id: string;
    name: string;
  }>;
  services?: Array<{
    id: string;
    category: string;
  }>;
}

interface ProfileContentProps {
  userData: UserData;
}

export const ProfileContent = ({ userData }: ProfileContentProps) => {
  const isContractor = userData.role === 'contractor';
  const hasCompanies = isContractor && userData.companies && userData.companies.length > 0;
  const hasServices = !isContractor && userData.services && userData.services.length > 0;
  const location = userData.city && userData.state ? `${userData.city}, ${userData.state}` : '';

  return (
    <div className="space-y-6">
      {userData.bio && (
        <div>
          <h3 className="text-lg font-medium mb-2">Sobre</h3>
          <p className="text-gray-700">{userData.bio}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact information would typically go here */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-md font-medium mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              Localização
            </h3>
            <p className="text-gray-600">
              {location || 'Localização não informada'}
            </p>
          </CardContent>
        </Card>
        
        {/* Companies (for contractors) */}
        {isContractor && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-md font-medium mb-3 flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-primary" />
                Empresas
              </h3>
              {hasCompanies ? (
                <ul className="space-y-2">
                  {userData.companies?.map(company => (
                    <li key={company.id} className="text-gray-600">
                      {company.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhuma empresa cadastrada</p>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Services (for providers) */}
        {!isContractor && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-md font-medium mb-3 flex items-center">
                <CheckSquare className="h-4 w-4 mr-2 text-primary" />
                Categorias de Serviço
              </h3>
              {hasServices ? (
                <ul className="space-y-2">
                  {userData.services?.map(service => (
                    <li key={service.id} className="text-gray-600">
                      {service.category}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhuma categoria cadastrada</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
