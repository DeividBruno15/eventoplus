
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { venueFormSchema, VenueFormValues } from "./components/VenueFormSchema";
import ImageUploadSection, { ImageFile } from "./components/ImageUploadSection";
import VenueBasicInfoFields from "./components/VenueBasicInfoFields";
import VenueSelector from "./components/VenueSelector";
import VenueAvailabilityCalendar from "./components/VenueAvailabilityCalendar";
import VenueAmenitiesField from "./components/VenueAmenitiesField";
import VenueRulesField from "./components/VenueRulesField";
import VenueSocialMediaLinks from "./components/VenueSocialMediaLinks";
import VenueAvailabilityToggle from "./components/VenueAvailabilityToggle";
import { useVenueFormSubmit } from "./hooks/useVenueFormSubmit";
import { supabase } from "@/integrations/supabase/client";

const CreateVenuePage = () => {
  const navigate = useNavigate();
  const [venueImages, setVenueImages] = useState<ImageFile[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [venueAddress, setVenueAddress] = useState<string>('');

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      title: "",
      description: "",
      venue_type: "",
      max_capacity: "",
      price_per_day: "",
      is_rentable: true,
      amenities: [],
      rules: "",
      external_link: "",
      venue_id: "",
      social_instagram: "",
      social_facebook: "",
      social_twitter: "",
    },
  });

  const { handleSubmit, submitting } = useVenueFormSubmit(venueImages, selectedDates);

  // Handle venue selection and populate address
  const handleVenueSelection = (venueId: string) => {
    const fetchVenueDetails = async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("user_venues")
          .select("street, number, neighborhood, city, state")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const formattedAddress = `${data.street}, ${data.number} - ${data.neighborhood}, ${data.city}/${data.state}`;
          setVenueAddress(formattedAddress);
        }
      } catch (error) {
        console.error("Error fetching venue details:", error);
        setVenueAddress('');
      }
    };
    
    if (venueId) {
      fetchVenueDetails(venueId);
    } else {
      setVenueAddress('');
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
        <FormProvider {...form}>
          <Form>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <VenueBasicInfoFields />
              
              <ImageUploadSection 
                venueImages={venueImages} 
                setVenueImages={setVenueImages}
              />
              
              <VenueSelector onVenueSelection={handleVenueSelection} />
              {venueAddress && (
                <p className="mt-1 text-sm text-gray-600">{venueAddress}</p>
              )}
              
              <VenueAvailabilityCalendar 
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
              />
              
              <VenueAmenitiesField />
              
              <VenueRulesField />
              
              <VenueSocialMediaLinks />
              
              <VenueAvailabilityToggle />
              
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
        </FormProvider>
      </Card>
    </div>
  );
};

export default CreateVenuePage;
