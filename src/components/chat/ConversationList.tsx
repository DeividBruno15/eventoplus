
import { Card } from '@/components/ui/card';
import ConversationItem from './ConversationItem';
import EmptyState from './EmptyState';
import { SearchBar } from './SearchBar';
import { ConversationListLoader } from './ConversationListLoader';
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
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>
      
      <div className="divide-y">
        {loading ? (
          <ConversationListLoader />
        ) : filteredConversations.length === 0 ? (
          <EmptyState totalConversations={conversations.length} />
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))
        )}
      </div>
    </Card>
  );
}
