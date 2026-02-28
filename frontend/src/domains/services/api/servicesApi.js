import axios from '@/utils/axios';

export const fetchServicesRequest = () => axios.get('/services');

export const createServiceRequest = (payload) => axios.post('/services', payload);

export const updateServiceRequest = (serviceId, payload) =>
  axios.put(`/services/${serviceId}`, payload);

export const deleteServiceRequest = (serviceId) => axios.delete(`/services/${serviceId}`);
