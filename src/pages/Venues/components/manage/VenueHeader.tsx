
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, Edit } from "lucide-react";
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface VenueHeaderProps {
  venueId: string;
  title: string;
  venueType: string;
  views: number;
}

const VenueHeader: React.FC<VenueHeaderProps> = ({
  venueId,
  title,
  venueType,
  views
}) => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint('md');
  
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/venues/manage')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>
              {venueType} • {views} visualizações
            </span>
          </div>
        </div>
      </div>

      <div className="md:ml-auto flex gap-2 mt-2 md:mt-0">
        <Button 
          variant="outline"
          onClick={() => navigate(`/venues/details/${venueId}`)}
          size={isMobile ? "sm" : "default"}
          className="whitespace-nowrap"
        >
          Ver anúncio
        </Button>
        <Button
          onClick={() => navigate(`/venues/edit/${venueId}`)}
          size={isMobile ? "sm" : "default"}
        >
          {!isMobile && <Edit className="h-4 w-4 mr-2" />}
          Editar
        </Button>
      </div>
    </div>
  );
};

export default VenueHeader;
