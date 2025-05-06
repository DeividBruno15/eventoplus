
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar } from 'lucide-react';
import { UserProfileData } from '../types';

interface UserProfileHeaderProps {
  userData: UserProfileData;
  averageRating?: number;
  ratingCount?: number;
  eventCount?: number;
}

export const UserProfileHeader = ({ 
  userData, 
  averageRating = 0, 
  ratingCount = 0, 
  eventCount = 0 
}: UserProfileHeaderProps) => {
  const fullName = `${userData.first_name} ${userData.last_name || ''}`;
  const location = userData.city && userData.state ? `${userData.city}, ${userData.state}` : '';
  
  const getInitials = () => {
    return `${userData.first_name.charAt(0)}${userData.last_name ? userData.last_name.charAt(0) : ''}`.toUpperCase();
  };
  
  const roleDisplay = userData.role === 'contractor' ? 'Contratante' : 'Prestador de Serviços';

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-primary/30 to-primary/10"></div>
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col md:flex-row gap-4 md:items-end -mt-12">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            {userData.avatar_url ? (
              <AvatarImage src={userData.avatar_url} alt={fullName} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1 pt-4 md:pt-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold">{fullName}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  {location && (
                    <>
                      <MapPin className="h-4 w-4" />
                      <span>{location}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-2 md:mt-0">
                <Badge variant="outline" className="text-xs px-2 py-1 bg-primary/10">
                  {roleDisplay}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm ml-1">({ratingCount} avaliações)</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-1" />
                <span>
                  {eventCount} {userData.role === 'contractor' ? 'Eventos' : 'Serviços prestados'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
