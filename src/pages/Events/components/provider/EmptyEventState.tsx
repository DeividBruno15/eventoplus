
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyEventStateProps {
  title: string;
  description: string;
}

export const EmptyEventState = ({ title, description }: EmptyEventStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-40 text-center p-6">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
