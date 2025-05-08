
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { Separator } from "@/components/ui/separator";
import { useVenueDetails } from "./hooks/useVenueDetails";
import { VenueActions } from "./components/VenueActions";
import { VenueHeader } from "./components/VenueHeader";
import { VenueImage } from "./components/VenueImage";
import { VenueDescription } from "./components/VenueDescription";
import { VenueLocation } from "./components/VenueLocation";
import { VenueAmenities } from "./components/VenueAmenities";
import { VenueRules } from "./components/VenueRules";
import { VenueSocialLinks } from "./components/VenueSocialLinks";
import { VenueSidebar } from "./components/VenueSidebar";
import { VenueDetailsLoading } from "./components/VenueDetailsLoading";
import { VenueNotFound } from "./components/VenueNotFound";
import VenueRatingsSection from "./components/VenueRatingsSection";

const VenueDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { venue, loading, selectedDates } = useVenueDetails(id);
  
  if (loading) {
    return <VenueDetailsLoading />;
  }
  
  if (!venue) {
    return <VenueNotFound />;
  }
  
  const isOwner = user?.id === venue.user_id;
  const userRole = user?.user_metadata?.role;
  const isAdvertiser = userRole === 'advertiser';
  
  // Handle image_urls properly, falling back to image_url if needed
  const imageUrls = venue.image_urls && venue.image_urls.length > 0 
    ? venue.image_urls 
    : venue.image_url 
      ? [venue.image_url] 
      : [];
  
  return (
    <div className="space-y-6">
      <VenueActions 
        isOwner={isOwner} 
        venueId={venue.id}
        userId={user?.id}
        venueUserId={venue.user_id}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <VenueHeader 
            title={venue.title} 
            venueType={venue.venue_type}
            maxCapacity={venue.max_capacity}
            isRentable={venue.is_rentable} 
          />
          
          <VenueImage 
            imageUrl={venue.image_url} 
            title={venue.title}
            imageUrls={imageUrls}
          />
          
          <VenueDescription 
            description={venue.description} 
            externalLink={venue.external_link} 
          />
          
          <Separator />
          
          <VenueLocation venue={venue.venue} />
          
          <VenueAmenities amenities={venue.amenities} />
          
          <VenueRules rules={venue.rules} />
          
          <VenueSocialLinks 
            socialLinks={venue.social_links} 
            externalLink={venue.external_link}
          />
          
          {/* Seção de avaliações */}
          {id && (
            <VenueRatingsSection 
              venueId={id}
              ownerId={venue.user_id}
            />
          )}
        </div>
        
        {/* Only show sidebar with reservation actions if user is not the owner or user is not an advertiser */}
        {(!isOwner || !isAdvertiser) ? (
          <VenueSidebar 
            pricePerHour={venue.price_per_hour}
            selectedDates={selectedDates}
            createdAt={venue.created_at}
            venueUserId={venue.user_id}
          />
        ) : (
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium text-lg">Gerenciar Anúncio</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Este é seu próprio anúncio. Você pode editar seus detalhes ou 
              gerenciar disponibilidade através do painel de controle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueDetailsPage;
