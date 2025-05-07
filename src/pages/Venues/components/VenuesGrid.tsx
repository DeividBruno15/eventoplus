
import { useState } from "react";
import { VenueAnnouncement } from "../types";
import VenueCard from "./VenueCard";
import VenueEmptyState from "./VenueEmptyState";
import VenueLoadingSkeleton from "./VenueLoadingSkeleton";

interface VenuesGridProps {
  announcements: VenueAnnouncement[];
  loading: boolean;
  onDeleteAnnouncement?: (id: string) => void;
}

const VenuesGrid = ({ announcements, loading, onDeleteAnnouncement }: VenuesGridProps) => {
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  
  const handleDelete = (id: string) => {
    setDeletedIds(prev => [...prev, id]);
    if (onDeleteAnnouncement) {
      onDeleteAnnouncement(id);
    }
  };
  
  const filteredAnnouncements = announcements.filter(
    announcement => !deletedIds.includes(announcement.id)
  );
  
  if (loading) {
    return <VenueLoadingSkeleton />;
  }

  if (filteredAnnouncements.length === 0) {
    return <VenueEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAnnouncements.map((announcement) => (
        <VenueCard 
          key={announcement.id} 
          announcement={announcement} 
          onDelete={() => handleDelete(announcement.id)}
        />
      ))}
    </div>
  );
};

export default VenuesGrid;
