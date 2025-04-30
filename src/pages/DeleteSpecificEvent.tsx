
import { useEffect, useState } from 'react';
import { deleteSpecificEvent } from '@/utils/events/eventDeletion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const DeleteSpecificEvent = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteSpecificEvent();
    setIsDeleting(false);
    setIsDeleted(true);
  };
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Exclusão de Evento Específico</CardTitle>
          <CardDescription>
            Esta página permite excluir o evento com ID 4705b1a9-8c99-4d5b-b62c-83bba2c3f9ab
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isDeleted ? (
            <div className="space-y-4">
              <p className="text-green-600 font-medium">
                O evento foi excluído com sucesso!
              </p>
              <Button onClick={() => navigate('/events')}>
                Voltar para a lista de eventos
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p>ID do Evento: 4705b1a9-8c99-4d5b-b62c-83bba2c3f9ab</p>
              <p>
                Clique no botão abaixo para excluir este evento específico.
                Esta ação excluirá primeiro todas as candidaturas associadas a este evento
                e depois o próprio evento.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Excluindo..." : "Excluir Evento"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/events')}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteSpecificEvent;
