
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteEventById } from "@/utils/events/eventDeletion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DeleteSpecificEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      toast.error("ID do evento inválido");
      navigate("/events");
      return;
    }

    const handleDelete = async () => {
      try {
        await deleteEventById(id);
        toast.success("Evento excluído com sucesso");
        navigate("/events");
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Falha ao excluir o evento");
        navigate("/events");
      }
    };

    handleDelete();
  }, [id, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h1 className="text-xl font-semibold mb-2">Excluindo evento...</h1>
        <p className="text-muted-foreground">Você será redirecionado em instantes.</p>
      </div>
    </div>
  );
};

export default DeleteSpecificEvent;
