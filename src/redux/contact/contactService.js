import axiosInstance from '../../axiosInstance';

const submitContact = async (formData) => {
    const response = await axiosInstance.post('/contacts', formData);
    return response.data;
};

const getContacts = async () => {
    const response = await axiosInstance.get('/contacts');
    return response.data;
};

const contactService = {
    submitContact,
    getContacts
};

export default contactService;
