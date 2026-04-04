import axiosInstance from '../../axiosInstance';

const getMyAppointments = async () => {
    const response = await axiosInstance.get('/appointments');
    return response.data;
};

const createAppointment = async (appointmentData) => {
    const response = await axiosInstance.post('/appointments', appointmentData);
    return response.data;
};

const appointmentService = {
    getMyAppointments,
    createAppointment
};

export default appointmentService;
