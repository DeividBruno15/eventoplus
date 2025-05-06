
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreateRating } from '@/components/ratings/CreateRating';
import { EventApplication } from '@/types/events';
import { toast } from 'sonner';

interface RateProviderModalProps {
  application: EventApplication;
  eventId: string;
}

export const RateProviderModal = ({ application, eventId }: RateProviderModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSuccess = () => {
    setIsOpen(false);
    toast.success("Avaliação enviada com sucesso!");
  };

  // Get the provider name from the provider object if available, otherwise use a generic title
  const providerName = application.provider?.first_name 
    ? `${application.provider.first_name} ${application.provider.last_name || ''}`
    : 'Prestador';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Avaliar serviço</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Avaliar {providerName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CreateRating 
            userId={application.provider_id} 
            eventId={eventId}
            onSuccess={onSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
