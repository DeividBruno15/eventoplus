
import { useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { fetchAddressFromCep } from '@/utils/cep';

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onAddressUpdate: () => void;
}

export const EditAddressModal = ({ isOpen, onClose, userData, onAddressUpdate }: EditAddressModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);
  const [formData, setFormData] = useState({
    street: userData?.user_metadata?.street || '',
    neighborhood: userData?.user_metadata?.neighborhood || '',
    city: userData?.user_metadata?.city || '',
    state: userData?.user_metadata?.state || '',
    zipcode: userData?.user_metadata?.zipcode || '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const searchCep = async () => {
    if (!formData.zipcode || formData.zipcode.length < 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, informe um CEP válido.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSearchingCep(true);
      const address = await fetchAddressFromCep(formData.zipcode);
      
      if (address.erro) {
        toast({
          title: "CEP não encontrado",
          description: "O CEP informado não foi encontrado.",
          variant: "destructive"
        });
        return;
      }
      
      setFormData({
        ...formData,
        street: address.logradouro || '',
        neighborhood: address.bairro || '',
        city: address.localidade || '',
        state: address.uf || '',
      });
      
      toast({
        title: "Endereço encontrado",
        description: "Endereço localizado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar o endereço pelo CEP.",
        variant: "destructive"
      });
    } finally {
      setSearchingCep(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          street: formData.street,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Endereço atualizado",
        description: "Seu endereço foi atualizado com sucesso."
      });
      
      onAddressUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar endereço",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Endereço</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="zipcode">CEP</Label>
              <Input 
                id="zipcode"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                placeholder="00000-000"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={searchCep} 
              disabled={searchingCep}
              className="mb-px"
            >
              {searchingCep ? "Buscando..." : "Buscar"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="street">Rua</Label>
            <Input 
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="Rua, Avenida, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input 
              id="neighborhood"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleInputChange}
              placeholder="Seu bairro"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input 
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Sua cidade"
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
