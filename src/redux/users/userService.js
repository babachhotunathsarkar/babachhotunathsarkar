import axiosInstance from '../../axiosInstance';

// GET current logged-in user
const getcurrentUSer = async () => {
  const response = await axiosInstance.get('/users/current-user');
  // Backend returns: { data: { user: {...} } }
  return response.data.data.user;
};

// PATCH update profile (supports FormData for image upload)
const updateProfile = async (userData) => {
  const response = await axiosInstance.patch('/users/update-profile', userData, {
    headers: userData instanceof FormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' },
  });
  // Backend returns: { data: { user: {...} } }
  return response.data.data.user;
};

const userService = {
  getcurrentUSer,
  updateProfile,
};

export default userService;