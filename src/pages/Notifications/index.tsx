
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Clock, Calendar, MessageCircle, CreditCard, AlertCircle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications(user?.id);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === activeTab);

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case 'rating':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { 
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `Você tem ${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}` 
              : 'Todas as notificações foram lidas'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">
            Todas
            <Badge variant="outline" className="ml-2">{notifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Não lidas
            <Badge variant="outline" className="ml-2">{unreadCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="event">Eventos</TabsTrigger>
          <TabsTrigger value="message">Mensagens</TabsTrigger>
          <TabsTrigger value="payment">Pagamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Bell className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                <h3 className="text-lg font-medium mb-1">Nenhuma notificação</h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === 'all' 
                    ? 'Você não tem notificações ainda.' 
                    : activeTab === 'unread' 
                      ? 'Todas as suas notificações foram lidas.' 
                      : `Você não tem notificações do tipo ${activeTab}.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={notification.read ? 'bg-card' : 'bg-muted/40 shadow-sm'}
                >
                  <CardContent className="p-4 flex items-start">
                    <div className="mr-4 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 cursor-pointer" onClick={() => handleViewNotification(notification)}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.content}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 opacity-30 hover:opacity-100"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        {selectedNotification && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedNotification.title}</DialogTitle>
              <DialogDescription className="pt-2">
                {formatDate(selectedNotification.created_at)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <p>{selectedNotification.content}</p>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedNotification(null)}
              >
                Fechar
              </Button>
              
              {selectedNotification.link && (
                <Button
                  asChild
                  onClick={() => setSelectedNotification(null)}
                >
                  <Link to={selectedNotification.link}>
                    Ver detalhes
                  </Link>
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default NotificationsPage;
