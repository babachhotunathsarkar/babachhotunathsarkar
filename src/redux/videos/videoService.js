// src/redux/videos/videoService.js
import axiosInstance from '../../axiosInstance';

const uploadVideo = async (formData) => {
  const response = await axiosInstance.post('/videos/upload', formData);
  return response.data;
};

const uploadMultipleVideos = async (formData) => {
  const response = await axiosInstance.post('/videos/upload-multiple', formData);
  return response.data;
};

const getAllVideos = async (params = {}) => {
  const q = new URLSearchParams();
  if (params.page)                              q.append('page',     params.page);
  if (params.limit)                             q.append('limit',    params.limit);
  if (params.category && params.category !== 'all') q.append('category', params.category);
  if (params.search)                            q.append('search',   params.search);
  const response = await axiosInstance.get(`/videos${q.toString() ? `?${q}` : ''}`);
  return response.data;
};

const getVideoById = async (id) => {
  const response = await axiosInstance.get(`/videos/${id}`);
  return response.data;
};

const getVideosByCategory = async (category, limit = 20) => {
  const response = await axiosInstance.get(`/videos/category/${category}`, { params: { limit } });
  return response.data;
};

const updateVideo = async (id, data) => {
  const response = await axiosInstance.put(`/videos/${id}`, data);
  return response.data;
};

const deleteVideo = async (id) => {
  const response = await axiosInstance.delete(`/videos/${id}`);
  return response.data;
};

const bulkDeleteVideos = async (videoIds) => {
  const response = await axiosInstance.post('/videos/bulk-delete', { videoIds });
  return response.data;
};

const VideoService = {
  uploadVideo, uploadMultipleVideos, getAllVideos,
  getVideoById, getVideosByCategory,
  updateVideo, deleteVideo, bulkDeleteVideos,
};

export default VideoService;