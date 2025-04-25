
export const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const getEventStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getEventStatusLabel = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmado';
    case 'pending':
      return 'Pendente';
    case 'completed':
      return 'Concluído';
    default:
      return status;
  }
};
