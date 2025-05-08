
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Reservation {
  id: string;
  user_id: string;
  venue_id: string;
  reservation_date: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'canceled';
  created_at: string;
  user_name?: string;
  user_email?: string;
  payment_id?: string;
}

interface VenueBasic {
  id: string;
  title: string;
}

interface ReservationsTabProps {
  venueId: string;
  venue: VenueBasic;
  reservations: Reservation[];
  loading: boolean;
}

const ReservationsTab: React.FC<ReservationsTabProps> = ({
  venueId, 
  venue,
  reservations,
  loading
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    setProcessingId(reservationId);
    try {
      const { error } = await supabase
        .from('venue_reservations')
        .update({ status: newStatus })
        .eq('id', reservationId);
        
      if (error) throw error;
      
      // Atualizar lista de reservas localmente para evitar recarregar todo o componente
      toast.success(`Status da reserva atualizado para ${getStatusLabel(newStatus)}`);
      
      // Enviar notificação para o usuário
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation) {
        await supabase.from('notifications').insert({
          user_id: reservation.user_id,
          title: `Reserva ${getStatusLabel(newStatus).toLowerCase()}`,
          content: `A reserva para ${venue.title} foi ${getStatusLabel(newStatus).toLowerCase()}`,
          type: 'reservation_update',
          link: `/venues/details/${venueId}`
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da reserva');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'confirmed': 'Confirmada',
      'rejected': 'Rejeitada',
      'canceled': 'Cancelada'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const statusColorMap: Record<string, string> = {
      'pending': 'bg-yellow-500',
      'confirmed': 'bg-green-500',
      'rejected': 'bg-red-500',
      'canceled': 'bg-gray-500'
    };
    return statusColorMap[status] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Reservas</CardTitle>
        <CardDescription>
          Visualize e gerencie as reservas para este local
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium mt-4">Nenhuma reserva encontrada</h3>
            <p className="text-muted-foreground mt-2">
              Este local ainda não possui reservas
            </p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      {format(new Date(reservation.reservation_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium">{reservation.user_name}</div>
                        <div className="text-xs text-muted-foreground">{reservation.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline"
                        className={`${getStatusColor(reservation.status)} text-white`}
                      >
                        {getStatusLabel(reservation.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {reservation.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={!!processingId}
                            onClick={() => handleStatusChange(reservation.id, 'rejected')}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            {processingId === reservation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Rejeitar'}
                          </Button>
                          <Button 
                            size="sm"
                            disabled={!!processingId}  
                            onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                          >
                            {processingId === reservation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar'}
                          </Button>
                        </div>
                      )}
                      {reservation.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={!!processingId}
                          onClick={() => handleStatusChange(reservation.id, 'canceled')}
                        >
                          {processingId === reservation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancelar'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationsTab;
