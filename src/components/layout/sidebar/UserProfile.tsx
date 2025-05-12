
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@supabase/supabase-js';

interface UserProfileProps {
  user: User | null;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userRole?: string;
}

export function UserProfile({
  user,
  firstName,
  lastName,
  avatarUrl,
  userRole
}: UserProfileProps) {
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="flex items-center px-2 py-4">
      <Avatar className="h-10 w-10 border border-border">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
        ) : (
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials()}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="ml-3 overflow-hidden">
        <p className="text-sm font-medium truncate">
          {firstName ? `${firstName} ${lastName}` : user?.email || 'Usuário'}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {user?.email}
        </p>
      </div>
    </div>
  );
}
