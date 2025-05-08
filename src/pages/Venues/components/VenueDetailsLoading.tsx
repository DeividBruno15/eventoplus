
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const VenueDetailsLoading = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
          
          {/* Main image */}
          <Skeleton className="h-96 w-full" />
          
          {/* Thumbnails */}
          <div className="flex gap-2">
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-16 w-24" />
            <Skeleton className="h-16 w-24" />
          </div>
          
          {/* Description */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-32" />
            <Card className="p-6">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          </div>
          
          <Separator />
          
          {/* Location */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-32" />
            <Card className="p-6">
              <div className="flex gap-3">
                <Skeleton className="h-6 w-6" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              
              <Separator />
              
              <Skeleton className="h-10 w-full" />
              
              <Skeleton className="h-64 w-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
