
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { fetchAddressByCep } from '@/utils/cep';

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onSuccess: () => void;
}

export const EditAddressModal = ({ isOpen, onClose, userData, onSuccess }: EditAddressModalProps) => {
  const [loading, setLoading] = useState(false);
  const [lookingUpZipcode, setLookingUpZipcode] = useState(false);
  
  const [formData, setFormData] = useState({
    zipcode: userData?.zipcode || '',
    street: userData?.street || '',
    number: userData?.number || '',
    neighborhood: userData?.neighborhood || '',
    city: userData?.city || '',
    state: userData?.state || '',
  });
  
  // Atualiza os dados quando userData muda
  useEffect(() => {
    if (userData) {
      setFormData({
        zipcode: userData?.zipcode || '',
        street: userData?.street || '',
        number: userData?.number || '',
        neighborhood: userData?.neighborhood || '',
        city: userData?.city || '',
        state: userData?.state || '',
      });
    }
  }, [userData]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleZipcodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipcode = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, zipcode }));
    
    if (zipcode.length === 8) {
      setLookingUpZipcode(true);
      try {
        const result = await fetchAddressByCep(zipcode);
        
        if (result) {
          setFormData(prev => ({
            ...prev,
            street: result.street || '',
            neighborhood: result.neighborhood || '',
            city: result.city || '',
            state: result.state || '',
          }));
        }
      } catch (error) {
        toast.error("Erro ao buscar CEP");
      } finally {
        setLookingUpZipcode(false);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Atualiza tabela user_profiles
      const { error } = await supabase
        .from('user_profiles')
        .update({
          zipcode: formData.zipcode,
          street: formData.street,
          number: formData.number,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        })
        .eq('id', userData.id);
      
      if (error) throw error;
      
      toast.success("Endereço atualizado");
      onSuccess();
    } catch (error: any) {
      toast.error("Erro ao atualizar endereço: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Endereço</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zipcode">CEP</Label>
            <div className="relative">
              <Input 
                id="zipcode"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleZipcodeChange}
                placeholder="Digite o CEP"
                maxLength={9}
                disabled={lookingUpZipcode}
              />
              {lookingUpZipcode && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Digite o CEP para preenchimento automático dos campos
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input 
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Nome da rua"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input 
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="Nº"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input 
              id="neighborhood"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleInputChange}
              placeholder="Bairro"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input 
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Cidade"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input 
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="UF"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar endereço"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
