
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/events';

interface ImageUploadProps {
  event: Event;
  userId: string | undefined;
  onSuccess: () => void;
}

export const ImageUpload = ({ event, userId, onSuccess }: ImageUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!event || !userId || event.contractor_id !== userId) {
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
    const filePath = `${event.id}/${Math.random().toString(36).slice(2)}.${fileExt}`;
    
    try {
      setUploading(true);
      
      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, file, {
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from('events')
        .update({
          image_url: publicUrl,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', event.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Sucesso",
        description: "Imagem do evento atualizada com sucesso",
      });
      
      onSuccess();
      
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload",
        description: error.message,
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <label htmlFor="event-image-upload" className="cursor-pointer">
      <Button variant="outline" disabled={uploading} className="cursor-pointer">
        <ImageIcon className="mr-2 h-4 w-4" />
        {uploading ? 'Enviando...' : 'Alterar imagem do evento'}
      </Button>
      <input 
        id="event-image-upload" 
        type="file" 
        className="sr-only" 
        accept="image/*" 
        disabled={uploading}
        onChange={handleImageUpload}
      />
    </label>
  );
};
