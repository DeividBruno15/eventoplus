
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Event, EventApplication } from '@/types/events';
import { getApplicationStatusColor } from '@/lib/utils';

interface ApplicationFormProps {
  event: Event;
  onSubmit: (message: string) => Promise<void>;
  userApplication: EventApplication | null;
  submitting: boolean;
}

export const ApplicationForm = ({ event, onSubmit, userApplication, submitting }: ApplicationFormProps) => {
  const navigate = useNavigate();
  const [applicationMessage, setApplicationMessage] = useState('');

  if (userApplication) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg">Sua candidatura</h3>
            <Badge 
              variant="outline" 
              className={`${getApplicationStatusColor(userApplication.status)} text-white`}
            >
              {userApplication.status === 'pending' ? 'Pendente' : 
               userApplication.status === 'accepted' ? 'Aprovada' : 
               userApplication.status === 'rejected' ? 'Rejeitada' : 'Desconhecido'}
            </Badge>
          </div>
          
          <p className="text-sm whitespace-pre-line border-l-2 pl-4 py-1 border-primary/50 bg-primary/5 italic mb-4">
            {userApplication.message}
          </p>
          
          {userApplication.status === 'accepted' && (
            <>
              <Separator className="my-4" />
              <div className="text-center">
                <p className="font-medium text-green-600 mb-2">
                  Parabéns! Sua candidatura foi aprovada.
                </p>
                <Button 
                  onClick={() => navigate('/chat')}
                  className="mt-2"
                >
                  Conversar com o contratante
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="font-medium text-lg mb-3">Candidatar-se a este evento</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Explique por que você é a pessoa ideal para este serviço.
        </p>
        
        <Textarea
          placeholder="Descreva sua experiência e por que você é uma boa escolha para este evento..."
          className="mb-4"
          rows={4}
          value={applicationMessage}
          onChange={(e) => setApplicationMessage(e.target.value)}
        />
        
        <Button 
          className="w-full" 
          onClick={() => onSubmit(applicationMessage)}
          disabled={submitting || !applicationMessage.trim()}
        >
          {submitting ? 
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </> : 
            'Enviar candidatura'
          }
        </Button>
      </CardContent>
    </Card>
  );
};
