
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NotLoggedInPlans = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-10">
      <p className="text-lg text-muted-foreground mb-4">
        Você precisa estar logado e ter um tipo de conta definido para ver os planos disponíveis.
      </p>
      <Button onClick={() => navigate('/login')}>Fazer Login</Button>
    </div>
  );
};
