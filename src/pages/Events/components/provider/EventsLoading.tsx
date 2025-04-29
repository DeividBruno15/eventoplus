
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const EventsLoading = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </CardContent>
    </Card>
  );
};
