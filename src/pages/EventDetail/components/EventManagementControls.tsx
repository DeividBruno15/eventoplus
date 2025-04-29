
import { Event } from '@/types/events';
import { ImageUpload } from './ImageUpload';
import { DeleteEvent } from './DeleteEvent';

interface EventManagementControlsProps {
  event: Event;
  userId: string | undefined;
  onSuccess: () => Promise<void>;
  isOwner: boolean;
}

export const EventManagementControls = ({ 
  event, 
  userId, 
  onSuccess,
  isOwner
}: EventManagementControlsProps) => {
  if (!isOwner) return null;
  
  return (
    <div className="p-6 border-t flex flex-wrap gap-4">
      <ImageUpload 
        event={event} 
        userId={userId} 
        onSuccess={onSuccess} 
      />
      <DeleteEvent 
        event={event} 
        userId={userId} 
      />
    </div>
  );
};
