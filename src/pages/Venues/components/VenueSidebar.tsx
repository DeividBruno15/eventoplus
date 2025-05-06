
import React from 'react';
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface VenueSidebarProps {
  pricePerHour: number;
  selectedDates: Date[];
  createdAt: string;
}

export const VenueSidebar = ({ pricePerHour, selectedDates, createdAt }: VenueSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Preço por dia</h3>
            <div className="text-2xl font-bold text-primary">
              R$ {pricePerHour.toFixed(2)}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Disponibilidade</h3>
            <div className="border rounded-lg p-4">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                className="w-full"
                locale={ptBR}
                disabled={(date) => date < new Date()}
              />
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Os dias destacados são as datas disponíveis para locação
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-xs text-gray-500">
        Anúncio criado em {format(new Date(createdAt), 'dd/MM/yyyy')}
      </p>
    </div>
  );
};
