
import { useState } from "react";
import { VenueFormValues } from "../components/VenueFormSchema";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import { ImageFile } from "../components/ImageUploadSection";
import { toast } from "sonner";

export const useVenueFormSubmit = (
  venueImages: ImageFile[],
  selectedDates: Date[]
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: VenueFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para criar um anúncio");
      return;
    }

    if (venueImages.length === 0) {
      toast.error("Adicione pelo menos uma imagem para o seu anúncio");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload images if not already uploaded
      const imageUrls = await Promise.all(
        venueImages.map(async (img) => {
          if (img.url) return img.url;

          // Upload to Supabase storage
          const fileName = `${Date.now()}-${img.file.name.replace(/\s/g, "_")}`;
          const filePath = `${user.id}/${fileName}`;

          const { data, error } = await supabase.storage
            .from("venue_images")
            .upload(filePath, img.file);

          if (error) throw error;

          // Get public URL
          const { data: publicData } = supabase.storage
            .from("venue_images")
            .getPublicUrl(data.path);

          return publicData.publicUrl;
        })
      );

      // 2. Prepare social links
      const socialLinks = [];
      if (values.social_instagram) {
        socialLinks.push({
          type: "instagram",
          url: values.social_instagram,
        });
      }
      if (values.social_facebook) {
        socialLinks.push({
          type: "facebook",
          url: values.social_facebook,
        });
      }
      if (values.social_twitter) {
        socialLinks.push({
          type: "twitter",
          url: values.social_twitter,
        });
      }

      // 3. Create venue announcement
      const { data: announcement, error } = await supabase
        .from("venue_announcements")
        .insert({
          title: values.title,
          description: values.description,
          venue_type: values.venue_type,
          max_capacity: values.max_capacity,
          price_per_hour: values.price_per_day, // Using price_per_day as hourly rate for now
          venue_id: values.venue_id,
          user_id: user.id,
          is_rentable: values.is_rentable,
          amenities: values.amenities,
          rules: values.rules,
          external_link: values.external_link || null,
          social_links: socialLinks.length > 0 ? socialLinks : null,
          image_url: imageUrls[0], // Primary image
          available_dates: selectedDates.map((date) => date.toISOString()),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Anúncio criado com sucesso!");
      navigate(`/venues/details/${announcement.id}`);
    } catch (error) {
      console.error("Error creating venue announcement:", error);
      toast.error("Erro ao criar anúncio. Tente novamente mais tarde.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleSubmit,
    submitting,
  };
};
