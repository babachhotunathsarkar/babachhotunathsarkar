import axiosInstance from '../../axiosInstance';

const getActiveSchedules = async () => {
  const response = await axiosInstance.get('/schedules');
  return response.data;
};

const getAllSchedules = async () => {
  const response = await axiosInstance.get('/schedules/admin');
  return response.data;
};

const createSchedule = async (data) => {
  const response = await axiosInstance.post('/schedules/admin', data);
  console.log("response", response.data);
  return response.data;
};

const updateSchedule = async (id, data) => {
  const response = await axiosInstance.put(`/schedules/admin/${id}`, data);
  return response.data;
};

const deleteSchedule = async (id) => {
  const response = await axiosInstance.delete(`/schedules/admin/${id}`);
  return response.data;
};

const toggleSchedule = async (id) => {
  const response = await axiosInstance.patch(`/schedules/admin/${id}/toggle`);
  return response.data;
};

const scheduleService = {
  getActiveSchedules,
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  toggleSchedule,
};

export default scheduleService;
