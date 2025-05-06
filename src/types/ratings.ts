
export interface Rating {
  id: string;
  user_id: string; // usuário que está sendo avaliado
  reviewer_id: string; // usuário que fez a avaliação
  rating: number; // valor de 1 a 5
  comment: string;
  event_id?: string; // evento associado (opcional)
  created_at: string;
}

export interface RatingWithUser extends Rating {
  reviewer_name: string;
  reviewer_avatar?: string | null;
}
