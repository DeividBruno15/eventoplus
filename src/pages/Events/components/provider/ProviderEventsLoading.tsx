
import React from "react";
import { Loader2 } from "lucide-react";

export const ProviderEventsLoading = () => {
  return (
    <div className="flex justify-center items-center h-60">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};
