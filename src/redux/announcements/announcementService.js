// src/redux/announcements/announcementService.js
import axiosInstance from '../../axiosInstance';

// Get All Announcements (Public)
const getAll = async (type = null) => {
  const url = type ? `/announcements?type=${type}` : '/announcements';
  const response = await axiosInstance.get(url);
  return response.data;
};

// Get Single Announcement (Public)
const getById = async (id) => {
  const response = await axiosInstance.get(`/announcements/${id}`);
  return response.data;
};

// Create Announcement (Admin only)
const create = async (announcementData) => {
  const response = await axiosInstance.post('/announcements', announcementData);
  return response.data;
};

// Update Announcement (Admin only)
const update = async (id, announcementData) => {
  const response = await axiosInstance.put(`/announcements/${id}`, announcementData);
  return response.data;
};

// Delete Announcement (Admin only)
const remove = async (id) => {
  const response = await axiosInstance.delete(`/announcements/${id}`);
  return response.data;
};

const announcementService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default announcementService;