
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const RatingsLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Skeleton key={star} className="h-4 w-4" />
                ))}
              </div>
            </div>
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatingsLoading;
