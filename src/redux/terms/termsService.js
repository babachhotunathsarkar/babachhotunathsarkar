import axiosInstance from '../../axiosInstance';

const getTerms = async () => {
    const res = await axiosInstance.get('/terms');
    return res.data;
};

const updateTerms = async (data) => {
    const res = await axiosInstance.put('/terms', data);
    return res.data;
};

const termsService = {
    getTerms,
    updateTerms,
};

export default termsService;
