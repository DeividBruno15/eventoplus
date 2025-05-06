
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { format } from "date-fns";
import { ImageFile } from "../components/ImageUploadSection";
import { v4 as uuidv4 } from "uuid";

interface SocialMediaLink {
  type: string;
  url: string;
}

interface VenueFormValues {
  title: string;
  description: string;
  venue_type: string;
  max_capacity: string;
  price_per_day: string;
  is_rentable: boolean;
  amenities: string[];
  rules?: string;
  external_link?: string;
  venue_id: string;
  social_instagram?: string;
}

export const useVenueFormSubmit = (venueImages: ImageFile[], selectedDates: Date[]) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const detectSocialMediaType = (url: string): string | null => {
    if (!url) return null;
    if (url.includes('instagram.com')) return 'instagram';
    return null;
  };

  const formatSocialLinks = (formValues: VenueFormValues): SocialMediaLink[] => {
    const links: SocialMediaLink[] = [];
    
    if (formValues.social_instagram) {
      links.push({ type: 'instagram', url: formValues.social_instagram });
    }
    
    if (formValues.external_link) {
      const type = detectSocialMediaType(formValues.external_link);
      if (type) {
        links.push({ type, url: formValues.external_link });
      } else if (formValues.external_link) {
        links.push({ type: 'external', url: formValues.external_link });
      }
    }
    
    return links;
  };

  const uploadImagesToStorage = async (): Promise<string[]> => {
    if (venueImages.length === 0) return [];
    
    try {
      const uploadedUrls: string[] = [];
      
      // Process each image
      for (const image of venueImages) {
        if (!user) continue;
        
        const fileExt = image.file.name.split('.').pop();
        const filePath = `${user.id}/${uuidv4()}.${fileExt}`;
        
        console.log("Uploading image to path:", filePath);
        
        const { error: uploadError, data } = await supabase.storage
          .from('venue_images')
          .upload(filePath, image.file);
          
        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }
        
        // Get the public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('venue_images')
          .getPublicUrl(filePath);
          
        if (publicUrlData?.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
          console.log("Image uploaded successfully:", publicUrlData.publicUrl);
        }
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Falha ao fazer upload das imagens');
      return [];
    }
  };

  const handleSubmit = async (data: VenueFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para criar um anúncio");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // First upload images if any
      const imageUrls = await uploadImagesToStorage();
      const mainImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;
      
      // Format social media links
      const socialLinks = formatSocialLinks(data);
      
      // Converter valores de string para número
      const maxCapacity = parseInt(data.max_capacity);
      const pricePerDay = parseFloat(data.price_per_day);
      
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
          price_per_hour: pricePerDay, // Keep database field name but use as price per day
          is_rentable: data.is_rentable,
          amenities: data.amenities,
          rules: data.rules || null,
          external_link: data.external_link || null,
          image_url: mainImageUrl,
          available_dates: selectedDates.map(date => format(date, 'yyyy-MM-dd')),
          social_links: socialLinks.length > 0 ? socialLinks : null
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

  return { handleSubmit, submitting };
};
