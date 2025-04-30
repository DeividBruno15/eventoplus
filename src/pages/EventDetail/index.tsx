
import { EventInfo } from './components/EventInfo';
import { EventDetailHeader } from './components/EventDetailHeader';
import { EventManagementControls } from './components/EventManagementControls';
import { EventActionPanel } from './components/EventActionPanel';
import { useEventState } from './hooks/useEventState';

const EventDetail = () => {
  const {
    user,
    event,
    applications,
    userRole,
    loading,
    userApplication,
    refetchEvent,
    submitting,
    handleApply,
    handleApproveApplication,
    handleRejectApplication,
    handleCancelApplication
  } = useEventState();

  console.log("Applications in EventDetail:", applications);

  // Determinar se o usuário é o proprietário do evento
  const isOwner = user && event && (event.user_id === user.id || event.contractor_id === user.id);

  return (
    <div className="space-y-6">
      <EventDetailHeader loading={loading} event={event} />
      
      {event && (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <EventInfo event={event} />
            
            <EventManagementControls 
              event={event}
              userId={user?.id}
              onSuccess={refetchEvent}
              isOwner={!!isOwner}
            />
          </div>
          
          <EventActionPanel
            userRole={userRole}
            event={event}
            userId={user?.id}
            applications={applications}
            userApplication={userApplication}
            submitting={submitting}
            handleApply={handleApply}
            handleApproveApplication={handleApproveApplication}
            handleRejectApplication={handleRejectApplication}
            handleCancelApplication={handleCancelApplication}
          />
        </>
      )}
    </div>
  );
};

export default EventDetail;
