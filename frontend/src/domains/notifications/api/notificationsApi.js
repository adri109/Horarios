import axios from '@/utils/axios';

export const fetchNotificationsRequest = () => axios.get('/notifications');

export const markNotificationAsReadRequest = (notificationId) =>
  axios.put(`/notifications/${notificationId}/read`, {});

export const markAllNotificationsAsReadRequest = () =>
  axios.put('/notifications/read-all', {});
