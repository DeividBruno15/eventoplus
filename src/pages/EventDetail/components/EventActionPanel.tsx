
import { Event, EventApplication } from '@/types/events';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationsList } from './ApplicationsList';

interface EventActionPanelProps {
  userRole: 'provider' | 'contractor' | null;
  event: Event;
  userId: string | undefined;
  applications: EventApplication[];
  userApplication: EventApplication | null;
  submitting: boolean;
  handleApply: (message: string, serviceCategory?: string) => Promise<void>;
  handleApproveApplication: (applicationId: string, providerId: string) => Promise<void>;
  handleCancelApplication: (applicationId: string) => Promise<void>;
}

export const EventActionPanel = ({
  userRole,
  event,
  userId,
  applications,
  userApplication,
  submitting,
  handleApply,
  handleApproveApplication,
  handleCancelApplication
}: EventActionPanelProps) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {userRole === 'provider' && (
        <div>
          <ApplicationForm 
            event={event}
            onSubmit={handleApply}
            userApplication={userApplication}
            submitting={submitting}
          />
        </div>
      )}
      
      {userRole === 'contractor' && 
       event.contractor_id === userId && (
        <div>
          <ApplicationsList 
            applications={applications}
            onApprove={handleApproveApplication}
            submitting={submitting}
            eventStatus={event.status}
          />
        </div>
      )}
    </div>
  );
};
