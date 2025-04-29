
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserService {
  id: string;
  category: string;
  description?: string | null;
}

interface ServiceSelectionProps {
  selectedService: string;
  setSelectedService: (value: string) => void;
  userServices: UserService[];
}

export const ServiceSelection = ({ selectedService, setSelectedService, userServices }: ServiceSelectionProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Selecione o serviço para este evento:
      </label>
      <Select value={selectedService} onValueChange={setSelectedService}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um serviço" />
        </SelectTrigger>
        <SelectContent>
          {userServices.map((service) => (
            <SelectItem key={service.id} value={service.category}>
              {service.category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
