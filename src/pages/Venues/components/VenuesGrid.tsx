
import { VenueAnnouncement } from "../types";
import VenueCard from "./VenueCard";
import VenueEmptyState from "./VenueEmptyState";
import VenueLoadingSkeleton from "./VenueLoadingSkeleton";

interface VenuesGridProps {
  announcements: VenueAnnouncement[];
  loading: boolean;
}

const VenuesGrid = ({ announcements, loading }: VenuesGridProps) => {
  if (loading) {
    return <VenueLoadingSkeleton />;
  }

  if (announcements.length === 0) {
    return <VenueEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {announcements.map((announcement) => (
        <VenueCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
};

export default VenuesGrid;
