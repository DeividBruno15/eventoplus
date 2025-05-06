
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const VenueDetailsLoading = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/venues')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
          <div className="h-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-gray-100 animate-pulse rounded w-5/6"></div>
            <div className="h-4 bg-gray-100 animate-pulse rounded w-4/6"></div>
          </div>
        </div>
        
        <Card className="h-80">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
