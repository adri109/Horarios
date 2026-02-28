import axios from '@/utils/axios';

export const fetchAppointmentsRequest = () => axios.get('/appointments');

export const updateAppointmentStatusRequest = (appointmentId, status) =>
  axios.put(`/appointments/${appointmentId}/status`, { status });
