
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteEventById } from "@/utils/events/eventDeletion";
import { toast } from "sonner";

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
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Excluindo evento...</h1>
        <p className="text-muted-foreground mt-2">Você será redirecionado em instantes.</p>
      </div>
    </div>
  );
};

export default DeleteSpecificEvent;
