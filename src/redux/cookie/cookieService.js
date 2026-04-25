import axiosInstance from '../../axiosInstance';

const getCookiePolicy = async () => {
    const res = await axiosInstance.get('/cookie');
    return res.data;
};

const updateCookiePolicy = async (data) => {
    const res = await axiosInstance.put('/cookie', data);
    return res.data;
};

const cookieService = {
    getCookiePolicy,
    updateCookiePolicy,
};

export default cookieService;
