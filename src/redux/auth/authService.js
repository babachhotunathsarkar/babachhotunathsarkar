// src/redux/auth/authService.js
import axiosInstance from '../../axiosInstance';

// Register
const register = async (userData) => {
  const response = await axiosInstance.post('/users/register', userData);
  return response.data;
};

// Login
const login = async (userData) => {
  const response = await axiosInstance.post('/users/login', userData);
  
  console.log('Raw API response:', response.data);
  
  if (response.data.success && response.data.data) {
    const userInfo = response.data.data.user;
    const token = response.data.data.JwtToken;
    
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', token);
    console.log('localStorage user set:', localStorage.getItem('user'));
    console.log('localStorage token set:', localStorage.getItem('token'));
  }
  
  // Normalized structure return karo
  return {
    user: response.data.data.user,
    token: response.data.data.JwtToken,
    message: response.data.message,
  };
};

// Forgot Password - Send OTP
const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/users/forgot-password', { email });
  return response.data;
};

// Verify OTP
const verifyOtp = async (email, otp) => {
  const response = await axiosInstance.post('/users/verify-otp', { email, otp });
  // This returns { success, message, userId, token }
  if (response.data.success && response.data.token) {
    localStorage.setItem('resetToken', response.data.token);
  }
  return response.data;
};

// Reset Password (Final Step)
const resetPassword = async (password) => {
  const token = localStorage.getItem('resetToken');
  const response = await axiosInstance.post('/users/forgot-password-reset', { password }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (response.data.success) {
    localStorage.removeItem('resetToken');
  }
  return response.data;
};

const authService = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
};

export default authService;