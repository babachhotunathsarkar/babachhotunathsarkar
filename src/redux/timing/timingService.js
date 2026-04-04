import axiosInstance from '../../axiosInstance';

const getActiveTimings = async () => {
  const response = await axiosInstance.get('/timings');
  return response.data;
};

const getAllTimings = async () => {
  const response = await axiosInstance.get('/timings/admin');
  return response.data;
};

const createTiming = async (data) => {
  const response = await axiosInstance.post('/timings/admin', data);
  return response.data;
};

const updateTiming = async (id, data) => {
  const response = await axiosInstance.put(`/timings/admin/${id}`, data);
  return response.data;
};

const deleteTiming = async (id) => {
  const response = await axiosInstance.delete(`/timings/admin/${id}`);
  return response.data;
};

const toggleTiming = async (id) => {
  const response = await axiosInstance.patch(`/timings/admin/${id}/toggle`);
  return response.data;
};

const timingService = {
  getActiveTimings,
  getAllTimings,
  createTiming,
  updateTiming,
  deleteTiming,
  toggleTiming,
};

export default timingService;
