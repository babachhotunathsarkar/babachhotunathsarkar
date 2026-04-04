// src/redux/adminUsers/adminUserService.js
import axiosInstance from '../../axiosInstance';

const getAllUsers = async (params = {}) => {
  const q = new URLSearchParams();
  if (params.page)                          q.append('page',   params.page);
  if (params.limit)                         q.append('limit',  params.limit);
  if (params.role && params.role !== 'all') q.append('role',   params.role);
  if (params.search)                        q.append('search', params.search);
  const res = await axiosInstance.get(`/users${q.toString() ? `?${q}` : ''}`);
  return res.data;
};

const getUserById     = async (id)         => (await axiosInstance.get(`/users/${id}`)).data;
const updateUserRole  = async (id, role)   => (await axiosInstance.put(`/users/${id}/role`, { role })).data;
const deleteUser      = async (id)         => (await axiosInstance.delete(`/users/${id}`)).data;
const bulkDeleteUsers = async (userIds)    => (await axiosInstance.delete('/users/bulk', { data: { userIds } })).data;
const getUserGrowth   = async ()           => (await axiosInstance.get('/users/growth')).data;

const AdminUserService = { getAllUsers, getUserById, updateUserRole, deleteUser, bulkDeleteUsers, getUserGrowth };
export default AdminUserService;