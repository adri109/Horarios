import axios from '@/utils/axios';

export const loginRequest = (payload) => axios.post('/auth/login', payload);

/** Solo comprueba si el email existe; no crea cuenta ni escribe datos. */
export const checkRegistrationEmailRequest = ({ email }) =>
  axios.post('/auth/check-email', { email });

export const registerRequest = (payload) =>
  axios.post('/auth/register', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

export const forgotPasswordRequest = (email) =>
  axios.post('/auth/forgot-password', { email });

export const resetPasswordRequest = (token, newPassword) =>
  axios.post('/auth/reset-password', { token, newPassword });
