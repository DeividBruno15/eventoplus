
import { Loader2, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ConversationItem from './ConversationItem';
import EmptyState from './EmptyState';
import { Conversation } from '@/types/chat';

interface ConversationListProps {
  loading: boolean;
  conversations: Conversation[];
  filteredConversations: Conversation[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function ConversationList({
  loading,
  conversations,
  filteredConversations,
  searchQuery,
  onSearchChange,
}: ConversationListProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar conversas"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredConversations.length === 0 ? (
        <EmptyState totalConversations={conversations.length} />
      ) : (
        <div className="divide-y">
          {filteredConversations.map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))}
        </div>
      )}
    </Card>
  );
}
