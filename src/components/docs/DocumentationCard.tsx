
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface DocumentationCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  color?: string;
}

export const DocumentationCard = ({ 
  title, 
  description, 
  icon, 
  path,
  color = "bg-primary/10"
}: DocumentationCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader>
        <div className={`w-10 h-10 rounded-md ${color} flex items-center justify-center mb-2`}>
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button 
          variant="ghost" 
          className="p-0 h-auto font-medium text-primary hover:text-primary/80"
          onClick={() => navigate(path)}
        >
          Ler mais
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentationCard;
