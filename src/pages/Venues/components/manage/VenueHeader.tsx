
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, Edit } from "lucide-react";

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
  
  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('/venues/manage')}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>
            {venueType} • {views} visualizações
          </span>
        </div>
      </div>

      <div className="ml-auto space-x-2">
        <Button 
          variant="outline"
          onClick={() => navigate(`/venues/details/${venueId}`)}
        >
          Ver anúncio
        </Button>
        <Button
          onClick={() => navigate(`/venues/edit/${venueId}`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>
    </div>
  );
};

export default VenueHeader;
