
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CreateConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateConversationDialog({ isOpen, onClose }: CreateConversationDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Buscar usuários pelo nome ou sobrenome
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao buscar usuários');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateConversation = async (userId: string) => {
    if (!user) return;
    
    setIsCreating(true);
    
    try {
      // Chamar a função RPC do Supabase para criar ou obter uma conversa
      const { data, error } = await supabase
        .rpc('create_or_get_conversation', {
          user_id_one: user.id,
          user_id_two: userId
        });
        
      if (error) throw error;
      
      const conversationId = data;
      
      toast.success('Conversa iniciada com sucesso!');
      onClose();
      
      // Navegar para a conversa criada
      navigate(`/conversation/${conversationId}`);
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      toast.error('Não foi possível iniciar a conversa');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return (firstName.charAt(0) + (lastName?.charAt(0) || '')).toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conversa</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 my-4">
          <Input 
            placeholder="Procurar por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            size="icon"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {isSearching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery.trim() 
                ? "Nenhum usuário encontrado" 
                : "Digite um nome para pesquisar"}
            </div>
          ) : (
            searchResults.map(user => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start p-3"
                onClick={() => handleCreateConversation(user.id)}
                disabled={isCreating}
              >
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarFallback>
                    {getUserInitials(user.first_name, user.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium">{user.first_name} {user.last_name}</p>
                </div>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
