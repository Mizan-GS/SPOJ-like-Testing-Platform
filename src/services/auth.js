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
    toast.error(err.response?.data?.message || 'Registration failed');
    return null;
  }
}

export default { loginaction, registeraction };
