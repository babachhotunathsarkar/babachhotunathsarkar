import axiosInstance from '../../axiosInstance';
 
const getAll    = async ()         => (await axiosInstance.get('/marquee')).data;
const create    = async (data)     => (await axiosInstance.post('/marquee/admin', data)).data;
const update    = async (id, data) => (await axiosInstance.put(`/marquee/admin/${id}`, data)).data;
const remove    = async (id)       => (await axiosInstance.delete(`/marquee/admin/${id}`)).data;
const toggle    = async (id)       => (await axiosInstance.patch(`/marquee/admin/${id}/toggle`)).data;
 
const MarqueeService = { getAll, create, update, remove, toggle };
export default MarqueeService;