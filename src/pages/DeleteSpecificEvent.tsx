
import { useEffect, useState } from 'react';
import { deleteSpecificEvent } from '@/utils/events/eventDeletion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DeleteSpecificEvent = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      console.log("Chamando deleteSpecificEvent");
      await deleteSpecificEvent();
      setIsDeleted(true);
    } catch (err: any) {
      console.error("Erro capturado no componente:", err);
      setError(err.message || "Erro desconhecido ao tentar excluir o evento");
      toast.error("Falha ao excluir evento. Veja o console para mais detalhes.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Verificar a conexão com o Supabase ao carregar o componente
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase.from('events').select('id').limit(1);
        
        if (error) {
          console.error("Erro ao testar conexão com Supabase:", error);
          setError(`Erro na conexão com o Supabase: ${error.message}`);
          return;
        }
        
        console.log("Conexão com Supabase testada com sucesso:", data);
      } catch (err: any) {
        console.error("Erro ao importar cliente Supabase:", err);
        setError(`Erro ao inicializar cliente Supabase: ${err.message}`);
      }
    };
    
    checkConnection();
  }, []);
  
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded-md">
              <p className="font-medium">Erro detectado:</p>
              <p>{error}</p>
            </div>
          )}
          
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
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Excluindo...
                    </>
                  ) : "Excluir Evento"}
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
