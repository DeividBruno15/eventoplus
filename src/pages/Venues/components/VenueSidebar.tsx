
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/auth';
import { Calendar, Clock } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import VenueAvailabilityCalendar from './VenueAvailabilityCalendar';
import { useVenueBooking } from '../hooks/useVenueBooking';

interface VenueSidebarProps {
  pricePerHour: number;
  selectedDates: Date[];
  createdAt: string;
  venueUserId: string;
  venueId?: string;
  venueName?: string;
  userIsAuthenticated?: boolean;
}

export const VenueSidebar = ({ 
  pricePerHour, 
  selectedDates,
  createdAt,
  venueUserId,
  venueId,
  venueName,
  userIsAuthenticated = false
}: VenueSidebarProps) => {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;
  const isAdvertiser = userRole === 'advertiser';
  const isAuthenticated = user ? true : userIsAuthenticated;
  const isOwner = user?.id === venueUserId;
  
  const [localSelectedDates, setLocalSelectedDates] = useState<Date[]>(selectedDates);
  
  const formattedCreationDate = createdAt ? 
    format(new Date(createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : '';
    
  const totalCost = pricePerHour * (localSelectedDates.length || 1);
  
  // Use the booking hook for payment functionality
  const { handleBooking, isBooking } = useVenueBooking(
    venueId || '',
    venueName || '',
    pricePerHour,
    localSelectedDates
  );
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">
                R$ {pricePerHour.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">/dia</span>
            </div>
            
            <div className="mt-2">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Anunciado em {formattedCreationDate}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {isOwner ? (
            // Opções para o proprietário do anúncio
            <div className="space-y-4">
              <h3 className="font-medium">Gerenciar disponibilidade</h3>
              <p className="text-sm text-muted-foreground">
                Este é o seu anúncio. Você pode gerenciar as datas disponíveis.
              </p>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => window.location.href = `/venues/edit/${venueId || window.location.pathname.split('/').pop()}`}
              >
                Editar anúncio
              </Button>
            </div>
          ) : (
            // Opções para usuários interessados em alugar
            <div className="space-y-4">
              <div>
                <p className="font-medium">Custo total</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-semibold">
                    R$ {totalCost.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {localSelectedDates.length > 0 ? `${localSelectedDates.length} dias` : '1 dia'}
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                disabled={!isAuthenticated || isBooking}
                onClick={isAuthenticated ? handleBooking : () => {
                  window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                }}
              >
                {isBooking ? 'Processando...' : 'Reservar'}
              </Button>
              
              {!isAuthenticated ? (
                <p className="text-xs text-center text-muted-foreground">
                  Faça login para reservar este local
                </p>
              ) : (
                <p className="text-xs text-center text-muted-foreground">
                  Você será redirecionado para o pagamento
                </p>
              )}
            </div>
          )}
          
          <Separator />
          
          {/* Calendar for date selection */}
          <div className="pt-2">
            <VenueAvailabilityCalendar 
              selectedDates={localSelectedDates}
              setSelectedDates={setLocalSelectedDates}
              readOnly={isOwner}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
