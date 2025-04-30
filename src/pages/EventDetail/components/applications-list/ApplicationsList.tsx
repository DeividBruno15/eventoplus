
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventApplication, EventStatus } from '@/types/events';
import { ApplicationCard } from './ApplicationCard';
import { EmptyApplications } from './EmptyApplications';
import { useApplicationsList } from './useApplicationsList';

interface ApplicationsListProps {
  applications: EventApplication[];
  onApprove: (applicationId: string, providerId: string) => Promise<void>;
  onReject: (applicationId: string, providerId: string) => Promise<void>;
  submitting: boolean;
  eventStatus: EventStatus;
}

export const ApplicationsList = ({
  applications,
  onApprove,
  onReject,
  submitting,
  eventStatus
}: ApplicationsListProps) => {
  const {
    localApplications,
    handleApprove,
    handleReject,
    isButtonDisabled
  } = useApplicationsList(applications);
  
  // Use localApplications for rendering
  const applicationsToShow = localApplications.length > 0 ? localApplications : applications;

  if (applicationsToShow.length === 0) {
    return <EmptyApplications />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidaturas ({applicationsToShow.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {applicationsToShow.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onApprove={(applicationId, providerId) => handleApprove(applicationId, providerId, onApprove)}
            onReject={(applicationId, providerId) => handleReject(applicationId, providerId, onReject)}
            isDisabled={isButtonDisabled(application.id, submitting, eventStatus)}
          />
        ))}
      </CardContent>
    </Card>
  );
};
