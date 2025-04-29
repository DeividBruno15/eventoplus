
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
  handleRejectApplication: (applicationId: string, providerId: string) => Promise<void>;
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
  handleRejectApplication,
  handleCancelApplication
}: EventActionPanelProps) => {
  console.log("Applications in EventActionPanel:", applications);
  console.log("Current user role:", userRole);
  console.log("Event contractor ID:", event.contractor_id);
  console.log("Current user ID:", userId);
  console.log("Is user the event contractor?", event.contractor_id === userId);

  // Check if there are any accepted applications for this event
  const hasAcceptedApplications = applications.some(app => app.status === 'accepted');
  
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
      
      {userId === event.contractor_id && (
        <div>
          <ApplicationsList 
            applications={applications}
            onApprove={handleApproveApplication}
            onReject={handleRejectApplication}
            submitting={submitting}
            eventStatus={event.status}
          />
        </div>
      )}
    </div>
  );
};
