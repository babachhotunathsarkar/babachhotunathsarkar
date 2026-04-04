import axiosInstance from '../../axiosInstance';

// Get Notifications
const getNotifications = async () => {
  const response = await axiosInstance.get('/notifications');
  return response.data;
};

// Mark Single as Read
const markAsRead = async (id) => {
  const response = await axiosInstance.put(`/notifications/${id}/read`);
  return response.data;
};

// Mark All as Read
const markAllAsRead = async () => {
  const response = await axiosInstance.put('/notifications/read-all');
  return response.data;
};

// Delete Notification
const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
};

const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationService;