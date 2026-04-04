import axiosInstance from '../../axiosInstance';

const getActiveSpecialDays = async () => {
  const response = await axiosInstance.get('/special-days');
  return response.data;
};

const getAllSpecialDays = async () => {
  const response = await axiosInstance.get('/special-days/admin');
  return response.data;
};

const createSpecialDay = async (data) => {
  const response = await axiosInstance.post('/special-days/admin', data);
  return response.data;
};

const updateSpecialDay = async (id, data) => {
  const response = await axiosInstance.put(`/special-days/admin/${id}`, data);
  return response.data;
};

const deleteSpecialDay = async (id) => {
  const response = await axiosInstance.delete(`/special-days/admin/${id}`);
  return response.data;
};

const toggleSpecialDay = async (id) => {
  const response = await axiosInstance.patch(`/special-days/admin/${id}/toggle`);
  return response.data;
};

const specialDayService = {
  getActiveSpecialDays,
  getAllSpecialDays,
  createSpecialDay,
  updateSpecialDay,
  deleteSpecialDay,
  toggleSpecialDay,
};

export default specialDayService;
