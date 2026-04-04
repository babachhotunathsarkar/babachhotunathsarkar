// src/redux/auth/authService.js
import axiosInstance from '../../axiosInstance';

const uploadImage = async (formData) => {
  const response = await axiosInstance.post('/images/upload', formData);
  return response.data;
};

const uploadMultipalImage = async (formData) => {
  const response = await axiosInstance.post('/images/upload-multiple', formData);
  return response.data;
};
const getAllImages = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.category && params.category !== 'all') queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);
  
  const response = await axiosInstance.get(`/images${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  return response.data;
};
const getImageById = async (id) => {
  const response = await axiosInstance.get(`/images/${id}`);
  return response.data;
};

// Get images by category
const getImagesByCategory = async (category, limit = 20) => {
  const response = await axiosInstance.get(`/images/category/${category}`, {
    params: { limit }
  });
  return response.data;
};

// Update image
const updateImage = async (id, data) => {
  const response = await axiosInstance.put(`/images/${id}`, data);
  return response.data;
};

// Delete image
const deleteImage = async (id) => {
  const response = await axiosInstance.delete(`/images/${id}`);
  return response.data;
};

// Bulk delete images
const bulkDeleteImages = async (imageIds) => {
  const response = await axiosInstance.post('/images/bulk-delete', { imageIds });
  return response.data;
};
const ImageService = {
    getAllImages,
  uploadImage,
 uploadMultipalImage,
 getImageById,
 getImagesByCategory,
 updateImage,
 deleteImage,
 bulkDeleteImages
};

export default ImageService;