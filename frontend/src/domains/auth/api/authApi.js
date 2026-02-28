import axios from '@/utils/axios';

export const loginRequest = (payload) => axios.post('/auth/login', payload);

export const registerRequest = (payload) =>
  axios.post('/auth/register', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

export const forgotPasswordRequest = (email) =>
  axios.post('/auth/forgot-password', { email });

export const resetPasswordRequest = (token, newPassword) =>
  axios.post('/auth/reset-password', { token, newPassword });
