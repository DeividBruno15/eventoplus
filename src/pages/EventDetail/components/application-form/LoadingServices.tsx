
import { Loader2 } from 'lucide-react';
import { CardContent } from '@/components/ui/card';

export const LoadingServices = () => {
  return (
    <CardContent className="flex flex-col items-center justify-center h-40 py-6">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-muted-foreground">Carregando serviços...</p>
    </CardContent>
  );
};
