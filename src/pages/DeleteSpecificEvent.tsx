
import { useEffect, useState } from 'react';
import { deleteSpecificEvent, simulateEventDeletion } from '@/utils/events/eventDeletion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, checkSupabaseConnection, SUPABASE_URL } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DeleteSpecificEvent = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      console.log("Chamando deleteSpecificEvent");
      await deleteSpecificEvent();
      setIsDeleted(true);
      
      // Configurar um redirecionamento automático após 3 segundos
      setTimeout(() => {
        navigate('/events?refresh=true', { replace: true });
      }, 3000);
      
    } catch (err: any) {
      console.error("Erro capturado no componente:", err);
      setError(err.message || "Erro desconhecido ao tentar excluir o evento");
      toast.error("Falha ao excluir evento. Veja o console para mais detalhes.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSimulate = async () => {
    setIsDeleting(true);
    try {
      await simulateEventDeletion('4705b1a9-8c99-4d5b-b62c-83bba2c3f9ab');
      toast.info("Simulação concluída. Verifique o console para detalhes.");
      
      // Apenas para demonstração na simulação
      setIsDeleted(true);
      setTimeout(() => {
        navigate('/events', { replace: true });
      }, 3000);
      
    } catch (err) {
      console.error("Erro na simulação:", err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Verificar a conexão com o Supabase ao carregar o componente
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('checking');
        
        // Coletar informações de debug
        const debugData: Record<string, any> = {
          url: SUPABASE_URL,
          browserInfo: navigator.userAgent,
          timestamp: new Date().toISOString(),
          env: import.meta.env.MODE
        };
        
        const isConnected = await checkSupabaseConnection();
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        
        debugData.connectionTestResult = isConnected;
        setDebugInfo(debugData);
        
        if (!isConnected) {
          setError('Não foi possível estabelecer conexão com o Supabase. Verifique sua conexão com a internet.');
        }
      } catch (err: any) {
        console.error("Erro ao verificar conexão:", err);
        setConnectionStatus('disconnected');
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
        <CardContent className="space-y-4">
          {/* Status da conexão */}
          <div className="mb-6">
            <div className={`flex items-center gap-2 p-2 rounded-md ${
              connectionStatus === 'connected' ? 'bg-green-50 text-green-700' : 
              connectionStatus === 'disconnected' ? 'bg-red-50 text-red-700' : 
              'bg-yellow-50 text-yellow-700'
            }`}>
              {connectionStatus === 'connected' && <CheckCircle className="h-5 w-5" />}
              {connectionStatus === 'disconnected' && <WifiOff className="h-5 w-5" />}
              {connectionStatus === 'checking' && <Loader2 className="h-5 w-5 animate-spin" />}
              <span>
                {connectionStatus === 'connected' && 'Conectado ao Supabase'}
                {connectionStatus === 'disconnected' && 'Sem conexão com o Supabase'}
                {connectionStatus === 'checking' && 'Verificando conexão...'}
              </span>
            </div>
          </div>
          
          {/* Mensagem de erro */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro detectado</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isDeleted ? (
            <div className="space-y-4">
              <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Sucesso</AlertTitle>
                <AlertDescription>O evento foi excluído com sucesso!</AlertDescription>
              </Alert>
              <p className="text-sm text-gray-500">Redirecionando para a lista de eventos...</p>
              <Button onClick={() => navigate('/events')} variant="outline">
                Voltar para a lista de eventos agora
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
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || connectionStatus !== 'connected'}
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
                <Button 
                  variant="secondary"
                  onClick={handleSimulate}
                  disabled={isDeleting}
                >
                  Simular Exclusão (Debug)
                </Button>
              </div>
            </div>
          )}
          
          {/* Informações de debug para desenvolvedores */}
          <div className="mt-8 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Informações de Diagnóstico:</h3>
            <pre className="bg-slate-50 p-3 rounded-md text-xs overflow-auto max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteSpecificEvent;
