
import React from 'react';

const RatingsLoading: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="border rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatingsLoading;
