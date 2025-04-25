
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventInfo } from './components/EventInfo';
import { ApplicationForm } from './components/ApplicationForm';
import { ApplicationsList } from './components/ApplicationsList';
import { useEventDetails } from './hooks/useEventDetails';
import { useEventApplications } from './hooks/useEventApplications';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);
  
  const { 
    event, 
    applications, 
    userRole, 
    loading, 
    userHasApplied, 
    userApplication,
    refetchEvent 
  } = useEventDetails({ id, user });
  
  const { 
    submitting, 
    handleApply, 
    handleApproveApplication 
  } = useEventApplications(event);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!event || !user || event.contractor_id !== user.id) {
      toast({
        title: "Erro",
        description: "Apenas o criador do evento pode fazer upload de imagem",
        variant: "destructive"
      });
      return;
    }

    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `events/${event.id}/${Math.random().toString(36).slice(2)}.${fileExt}`;
    
    try {
      setUploadingImage(true);
      
      // Create events bucket if it doesn't exist
      await supabase.storage
        .createBucket('events', { public: true })
        .catch(() => {
          // Bucket might already exist, continue
        });
      
      // Upload image
      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);
      
      // Update event using a type assertion to match what Supabase expects
      const { error: updateError } = await supabase
        .from('events')
        .update({
          image_url: publicUrl,
          updated_at: new Date().toISOString()
        } as any) // Using type assertion to bypass TypeScript's checks
        .eq('id', event.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Sucesso",
        description: "Imagem do evento atualizada com sucesso",
      });
      
      // Refetch event to get updated data
      refetchEvent();
      
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload",
        description: error.message,
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event || !user || event.contractor_id !== user.id) {
      toast({
        title: "Erro",
        description: "Apenas o criador do evento pode excluí-lo",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setDeletingEvent(true);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);
        
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Evento excluído com sucesso",
      });
      
      // Redirecione para a página de eventos
      navigate('/events');
      
    } catch (error: any) {
      toast({
        title: "Erro ao excluir evento",
        description: error.message,
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setDeletingEvent(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !event ? (
          <Card className="text-center py-16">
            <CardContent>
              <h3 className="text-xl font-medium mb-2">Evento não encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Este evento pode ter sido removido ou você não tem permissão para acessá-lo.
              </p>
              <Button onClick={() => navigate('/events')}>
                Voltar para eventos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Evento principal */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <EventInfo event={event} />
              
              {userRole === 'contractor' && event.contractor_id === user?.id && (
                <div className="p-6 border-t flex flex-wrap gap-4">
                  <label htmlFor="event-image-upload" className="cursor-pointer">
                    <Button variant="outline" disabled={uploadingImage} className="cursor-pointer">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {uploadingImage ? 'Enviando...' : 'Alterar imagem do evento'}
                    </Button>
                    <input 
                      id="event-image-upload" 
                      type="file" 
                      className="sr-only" 
                      accept="image/*" 
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                    />
                  </label>
                  
                  <Button 
                    variant="destructive" 
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir evento
                  </Button>
                </div>
              )}
            </div>
            
            {/* Painel lateral agora abaixo no layout mobile */}
            <div className="grid gap-6 lg:grid-cols-2">
              {userRole === 'provider' && 
               (event.status === 'open' || event.status === 'published') && (
                <div>
                  <ApplicationForm 
                    event={event}
                    onSubmit={handleApply}
                    userApplication={userApplication}
                    submitting={submitting}
                  />
                </div>
              )}
              
              {userRole === 'contractor' && 
               event.contractor_id === user?.id && (
                <div>
                  <ApplicationsList 
                    applications={applications}
                    onApprove={handleApproveApplication}
                    submitting={submitting}
                    eventStatus={event.status}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
      
      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir evento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvent}
              disabled={deletingEvent}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deletingEvent ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventDetail;
