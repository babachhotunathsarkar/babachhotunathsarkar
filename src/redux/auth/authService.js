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

// Logout
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;