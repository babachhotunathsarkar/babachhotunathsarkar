import axiosInstance from '../../axiosInstance';
 
const getAll   = async (params = {}) => {
  const q = new URLSearchParams();
  if (params.page)     q.append('page',     params.page);
  if (params.limit)    q.append('limit',    params.limit);
  if (params.search)   q.append('search',   params.search);
  if (params.category && params.category !== 'all') q.append('category', params.category);
  
  const endpoint = params.isAdmin ? '/events/admin/all' : '/events';
  return (await axiosInstance.get(`${endpoint}${q.toString() ? `?${q}` : ''}`)).data;
};
const create   = async (data)     => (await axiosInstance.post('/events/admin', data)).data;
const update   = async (id, data) => (await axiosInstance.put(`/events/admin/${id}`, data)).data;
const remove   = async (id)       => (await axiosInstance.delete(`/events/admin/${id}`)).data;
const toggle   = async (id)       => (await axiosInstance.patch(`/events/admin/${id}/toggle`)).data;
 
const EventService = { getAll, create, update, remove, toggle };
export default EventService;