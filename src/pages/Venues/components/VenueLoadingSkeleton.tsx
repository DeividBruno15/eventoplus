
import { Card, CardContent } from "@/components/ui/card";

interface VenueLoadingSkeletonProps {
  count?: number;
}

const VenueLoadingSkeleton = ({ count = 3 }: VenueLoadingSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 animate-pulse rounded mb-3 w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-5/6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VenueLoadingSkeleton;
