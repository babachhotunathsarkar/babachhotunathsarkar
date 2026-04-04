import axiosInstance from '../../axiosInstance';
 
// Public - no auth needed. Uses the existing GET /address/ route
// which returns the main/first address object.
const getPublic = async () => (await axiosInstance.get('/address')).data;

// Admin-only routes
const getAll   = async ()         => (await axiosInstance.get('/address/admin/all')).data;
const create   = async (data)     => (await axiosInstance.post('/address/admin', data)).data;
const update   = async (id, data) => (await axiosInstance.put(`/address/admin/${id}`, data)).data;
const remove   = async (id)       => (await axiosInstance.delete(`/address/admin/${id}`)).data;
const setMain  = async (id)       => (await axiosInstance.patch(`/address/admin/${id}/set-main`)).data;
 
const AddressService = { getPublic, getAll, create, update, remove, setMain };
export default AddressService;