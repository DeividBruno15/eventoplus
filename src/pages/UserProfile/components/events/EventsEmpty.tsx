
interface EventsEmptyProps {
  userRole: 'contractor' | 'provider';
}

export const EventsEmpty = ({ userRole }: EventsEmptyProps) => (
  <div className="text-center py-8">
    <h3 className="text-lg font-medium text-gray-500">
      {userRole === 'contractor' ? 'Nenhum evento criado' : 'Nenhum serviço prestado'}
    </h3>
    <p className="text-sm text-gray-500 mt-1">
      {userRole === 'contractor' 
        ? 'Este usuário ainda não criou eventos' 
        : 'Este prestador ainda não prestou serviços'
      }
    </p>
  </div>
);
