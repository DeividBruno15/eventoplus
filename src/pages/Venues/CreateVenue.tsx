import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, X, Image, Upload, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 10;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const venueFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição muito curta").max(1000, "Descrição muito longa"),
  venue_type: z.string().min(1, "Selecione o tipo de espaço"),
  max_capacity: z.string().min(1, "Informe a capacidade máxima"),
  price_per_hour: z.string().min(1, "Informe o preço por hora"),
  is_rentable: z.boolean().default(true),
  amenities: z.array(z.string()).default([]),
  rules: z.string().max(500, "Regras muito longas").optional(),
  external_link: z.string().url("URL inválida").or(z.string().length(0)).optional(),
  venue_id: z.string().min(1, "Selecione um local cadastrado"),
});

type VenueFormValues = z.infer<typeof venueFormSchema>;

interface Venue {
  id: string;
  name: string;
  street: string;
  number: string;
  city: string;
  state: string;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const CreateVenuePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [venueImages, setVenueImages] = useState<ImageFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      title: "",
      description: "",
      venue_type: "",
      max_capacity: "",
      price_per_hour: "",
      is_rentable: true,
      amenities: [],
      rules: "",
      external_link: "",
      venue_id: "",
    },
  });

  // Fetch user venues
  useEffect(() => {
    const fetchUserVenues = async () => {
      if (!user) return;
      
      try {
        setIsLoadingVenues(true);
        const { data, error } = await supabase
          .from("user_venues")
          .select("id, name, street, number, city, state")
          .eq("user_id", user.id)
          .order("name");
          
        if (error) throw error;
        
        setVenues(data || []);
      } catch (error) {
        console.error("Error fetching venues:", error);
        toast.error("Erro ao carregar seus locais");
      } finally {
        setIsLoadingVenues(false);
      }
    };
    
    fetchUserVenues();
  }, [user]);

  // Create URL previews and cleanup on unmount
  useEffect(() => {
    // Cleanup function to revoke object URLs to avoid memory leaks
    return () => {
      venueImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [venueImages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadError(null);
    
    const selectedFiles = Array.from(e.target.files);
    
    if (venueImages.length + selectedFiles.length > MAX_IMAGES) {
      setUploadError(`Você pode enviar no máximo ${MAX_IMAGES} imagens`);
      return;
    }
    
    const newImages: ImageFile[] = [];
    
    selectedFiles.forEach(file => {
      // Validate file size
      if (file.size > MAX_IMAGE_SIZE) {
        setUploadError(`A imagem ${file.name} excede o tamanho máximo de 5MB`);
        return;
      }
      
      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setUploadError(`Tipo de arquivo não suportado: ${file.type}`);
        return;
      }
      
      const imageId = uuidv4();
      newImages.push({
        id: imageId,
        file,
        preview: URL.createObjectURL(file)
      });
    });
    
    if (newImages.length > 0) {
      setVenueImages(prev => [...prev, ...newImages]);
    }
    
    // Reset the input
    e.target.value = '';
  };
  
  const removeImage = (imageId: string) => {
    setVenueImages(venueImages.filter(image => {
      if (image.id === imageId) {
        URL.revokeObjectURL(image.preview);
        return false;
      }
      return true;
    }));
  };

  const uploadImagesToStorage = async (): Promise<string | null> => {
    if (venueImages.length === 0) return null;
    
    try {
      // For this example, we'll use the first image as the main image
      const mainImage = venueImages[0];
      const fileExt = mainImage.file.name.split('.').pop();
      const filePath = `venue_images/${user?.id}/${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('venue_images')
        .upload(filePath, mainImage.file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded image
      const { data } = supabase.storage
        .from('venue_images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Falha ao fazer upload da imagem');
      return null;
    }
  };

  const amenitiesList = [
    { id: "parking", label: "Estacionamento" },
    { id: "wifi", label: "Wi-Fi" },
    { id: "restrooms", label: "Banheiros" },
    { id: "stage", label: "Palco" },
    { id: "aircon", label: "Ar-condicionado" },
    { id: "kitchen", label: "Cozinha" },
    { id: "sound", label: "Sistema de som" },
    { id: "lighting", label: "Iluminação" },
  ];
  
  const venueTypes = [
    { value: "party_hall", label: "Salão de festas" },
    { value: "concert_hall", label: "Casa de shows" },
    { value: "outdoor_space", label: "Espaço aberto" },
    { value: "auditorium", label: "Auditório" },
    { value: "wedding_venue", label: "Espaço para casamentos" },
    { value: "conference_room", label: "Sala de conferências" },
  ];

  const onSubmit = async (data: VenueFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para criar um anúncio");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // First upload images if any
      const imageUrl = await uploadImagesToStorage();
      
      // Converter valores de string para número
      const maxCapacity = parseInt(data.max_capacity);
      const pricePerHour = parseFloat(data.price_per_hour);
      
      // Inserir o anúncio no banco de dados
      const { data: insertData, error } = await supabase
        .from('venue_announcements')
        .insert({
          user_id: user.id,
          venue_id: data.venue_id,
          title: data.title,
          description: data.description,
          venue_type: data.venue_type,
          max_capacity: maxCapacity,
          price_per_hour: pricePerHour,
          is_rentable: data.is_rentable,
          amenities: data.amenities,
          rules: data.rules || null,
          external_link: data.external_link || null,
          image_url: imageUrl
        })
        .select('id')
        .single();

      if (error) throw error;
      
      toast.success("Anúncio criado com sucesso!");
      navigate("/venues");
    } catch (error: any) {
      console.error("Error submitting venue announcement:", error);
      toast.error(error.message || "Erro ao criar anúncio");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Criar Anúncio</h2>
        <p className="text-muted-foreground">
          Preencha os detalhes do seu espaço para eventos
        </p>
      </div>
      
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do anúncio</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do anúncio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="venue_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de espaço</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de espaço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {venueTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Imagem upload section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium mb-2">Imagens do espaço</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Adicione até 10 imagens do seu espaço (máximo 5MB por imagem)
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Adicionar</span>
                  </div>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                  />
                </label>
                
                {venueImages.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {venueImages.map(image => (
                      <div key={image.id} className="relative flex-shrink-0">
                        <img
                          src={image.preview}
                          alt="Venue preview"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                        {venueImages[0].id === image.id && (
                          <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
              
              <p className="text-xs text-muted-foreground">
                {venueImages.length} de {MAX_IMAGES} imagens
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva seu espaço em detalhes" 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Descreva características, diferenciais e pontos fortes do seu espaço.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um local cadastrado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingVenues ? (
                        <SelectItem value="loading" disabled>
                          Carregando locais...
                        </SelectItem>
                      ) : venues.length > 0 ? (
                        venues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name} ({venue.street}, {venue.number})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Nenhum local cadastrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione um local cadastrado ou adicione um novo em seu perfil.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="max_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade máxima</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 100" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price_per_hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço por hora (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 150" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Comodidades</FormLabel>
                    <FormDescription>
                      Selecione os itens disponíveis no local
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {amenitiesList.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regras do local</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: Não permitido animais, não é permitido colar itens nas paredes, etc." 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="external_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link externo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Link para um site ou página de redes sociais com mais informações
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_rentable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Disponível para aluguel</FormLabel>
                    <FormDescription>
                      Ativar para mostrar que seu espaço está disponível para locação
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/venues")}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? "Criando..." : "Criar Anúncio"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateVenuePage;
