import api from './api';
import { toast } from 'react-toastify';

export async function loginaction(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password });
    toast.success('Login successful');
    return res;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Invalid credentials');
    return null;
  }
}

export async function registeraction(payload) {
  try {
    const res = await api.post('/auth/register', payload);
    toast.success('Verification email sent. Please check your inbox.');
    return res;
  } catch (err) {
    // Log full response for debugging (server validation errors usually live here)
    console.error('Register error response:', err.response);
    const serverMsg = err.response?.data?.message || JSON.stringify(err.response?.data) || 'Registration failed';
    toast.error(serverMsg);
    return null;
  }
}

export default { loginaction, registeraction };
