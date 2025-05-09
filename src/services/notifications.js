
// Notification service to handle sending notifications to users

export const notificationsService = {
  /**
   * Send a notification to a user
   * @param {Object} notification - Notification object
   * @param {string} notification.userId - User ID to send notification to
   * @param {string} notification.title - Notification title
   * @param {string} notification.content - Notification content
   * @param {string} notification.type - Notification type
   * @param {string} notification.link - Link to redirect when notification is clicked
   * @returns {Promise<boolean>} - Success status
   */
  async sendNotification({ userId, title, content, type, link }) {
    try {
      console.log(`Sending notification to ${userId}:`, { title, content, type, link });
      
      if (!userId) {
        console.error('Cannot send notification: Missing userId');
        return false;
      }
      
      const { data, error } = await supabase.from('notifications').insert({
        user_id: userId,
        title,
        content,
        type,
        link,
        read: false
      });
      
      if (error) {
        console.error('Error sending notification:', error);
        return false;
      }
      
      console.log('Notification sent successfully:', data);
      return true;
    } catch (err) {
      console.error('Unexpected error in sendNotification:', err);
      return false;
    }
  },
  
  /**
   * Mark a notification as read
   * @param {string} notificationId - ID of the notification to mark as read
   * @returns {Promise<boolean>} - Success status
   */
  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      return !error;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }
};
