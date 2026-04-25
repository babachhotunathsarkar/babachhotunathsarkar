import axiosInstance from '../../axiosInstance';

const getPrivacyPolicy = async () => {
    const res = await axiosInstance.get('/privacy');
    return res.data;
};

const updatePrivacyPolicy = async (data) => {
    const res = await axiosInstance.put('/privacy', data);
    return res.data;
};

const privacyService = {
    getPrivacyPolicy,
    updatePrivacyPolicy,
};

export default privacyService;
