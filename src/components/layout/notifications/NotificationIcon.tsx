
import { 
  Bell, 
  Calendar, 
  Star, 
  Home, 
  Mail, 
  MapPin, 
  DollarSign,
  Users,
  AlertCircle
} from 'lucide-react';

interface NotificationIconProps {
  type?: string;
}

export const NotificationIcon = ({ type }: NotificationIconProps) => {
  // Function to determine the icon based on notification type
  const getNotificationIcon = () => {
    const notificationType = type || '';
    
    if (notificationType.includes('rating')) return <Star className="h-5 w-5 text-yellow-500" />;
    if (notificationType.includes('payment')) return <DollarSign className="h-5 w-5 text-green-600" />;
    if (notificationType.includes('refund')) return <DollarSign className="h-5 w-5 text-orange-500" />;
    if (notificationType.includes('event')) return <Calendar className="h-5 w-5 text-blue-500" />;
    if (notificationType.includes('venue')) return <Home className="h-5 w-5 text-purple-500" />;
    if (notificationType.includes('location')) return <MapPin className="h-5 w-5 text-indigo-500" />;
    if (notificationType.includes('message')) return <Mail className="h-5 w-5 text-cyan-500" />;
    if (notificationType.includes('application')) return <Users className="h-5 w-5 text-indigo-600" />;
    if (notificationType.includes('system')) return <AlertCircle className="h-5 w-5 text-red-500" />;
    
    return <Bell className="h-5 w-5 text-gray-500" />;
  };

  return getNotificationIcon();
};
