
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VenueAnnouncement } from "../types";

interface VenueCardProps {
  announcement: VenueAnnouncement;
}

const VenueCard = ({ announcement }: VenueCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card key={announcement.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="h-48 bg-gray-200 bg-cover bg-center"
        style={{ 
          backgroundImage: announcement.image_url 
            ? `url(${announcement.image_url})` 
            : undefined 
        }}
      />
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {announcement.description}
        </p>
        <div className="flex flex-col gap-1 mt-2">
          <p className="text-xs text-gray-600">Local: {announcement.venue_name}</p>
          {announcement.address && (
            <p className="text-xs text-gray-600 line-clamp-1">
              Endereço: {announcement.address}
            </p>
          )}
          <p className="text-xs text-gray-600">Tipo: {announcement.venue_type}</p>
          <p className="text-sm font-semibold text-primary">
            R$ {announcement.price_per_hour.toFixed(2)}/dia
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {announcement.views} visualizações
          </span>
        </div>
        
        {/* Social Media Links Section - Always present with fixed height */}
        <div className="flex gap-2 mt-3 h-6 items-center">
          {announcement.social_links && announcement.social_links.length > 0 ? (
            announcement.social_links
              .filter(link => link.type === 'instagram' || link.type === 'external')
              .map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  {link.type === 'instagram' ? (
                    <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </span>
                  ) : (
                    <span className="bg-gray-400 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </span>
                  )}
                </a>
              ))
          ) : (
            // Placeholder div to maintain height when no social links
            <div className="h-6"></div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4 bg-gray-50">
        <div className="w-full flex gap-3 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/venues/details/${announcement.id}`)}
          >
            Detalhes
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate(`/venues/edit/${announcement.id}`)}
          >
            Editar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VenueCard;
