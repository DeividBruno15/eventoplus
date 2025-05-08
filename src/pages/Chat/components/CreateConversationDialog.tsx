
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CreateConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateConversation: (userId: string, userName: string) => void;
}

export function CreateConversationDialog({
  open,
  onOpenChange,
  onCreateConversation
}: CreateConversationDialogProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!open) return;

      setIsLoading(true);
      try {
        // Buscar usuários que não são o usuário atual
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name')
          .neq('id', user?.id || '')
          .order('first_name', { ascending: true });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de usuários",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [open, user, toast]);

  const handleCreateConversation = async () => {
    if (!selectedUserId || !user) {
      toast({
        title: "Erro",
        description: "Selecione um usuário para iniciar uma conversa",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Usar a função create_or_get_conversation para criar/obter uma conversa
      const { data, error } = await supabase
        .rpc('create_or_get_conversation', {
          user_id_one: user.id,
          user_id_two: selectedUserId,
        });

      if (error) throw error;

      // Navegue para a conversa recém-criada
      if (data) {
        const selectedUser = users.find(u => u.id === selectedUserId);
        const userName = selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : '';
        
        onCreateConversation(selectedUserId, userName);
        onOpenChange(false);
        navigate(`/conversation/${data}`);
        
        toast({
          title: "Conversa criada",
          description: `Conversa iniciada com ${userName}`,
        });
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a conversa",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = searchTerm
    ? users.filter(user => 
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : users;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova conversa</DialogTitle>
          <DialogDescription>
            Selecione um usuário para iniciar uma conversa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Carregando usuários...
                  </SelectItem>
                ) : filteredUsers.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Nenhum usuário encontrado
                  </SelectItem>
                ) : (
                  filteredUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {`${user.first_name} ${user.last_name}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={!selectedUserId || isLoading}
          >
            {isLoading ? "Criando..." : "Criar conversa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
