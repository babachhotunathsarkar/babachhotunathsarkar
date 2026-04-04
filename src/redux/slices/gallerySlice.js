import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  photos: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1545378953-61f11e04a53f?w=800',
      title: 'मंदिर का मुख्य द्वार',
      category: 'temple',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?w=800',
      title: 'नवरात्रि उत्सव',
      category: 'festival',
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1609941871666-5da8a26c5879?w=800',
      title: 'पूजा अर्चना',
      category: 'puja',
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1567591370504-80d5e5b370a2?w=800',
      title: 'दीपावली की सजावट',
      category: 'festival',
      createdAt: new Date().toISOString(),
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800',
      title: 'आरती का समय',
      category: 'puja',
      createdAt: new Date().toISOString(),
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800',
      title: 'दीप प्रज्वलन',
      category: 'festival',
      createdAt: new Date().toISOString(),
    },
  ],
  categories: ['all', 'temple', 'festival', 'puja'],
  selectedCategory: 'all',
  lightboxImage: null,
  loading: false,
}

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    addPhoto: (state, action) => {
      state.photos.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      })
    },
    removePhoto: (state, action) => {
      state.photos = state.photos.filter(photo => photo.id !== action.payload)
    },
    updatePhoto: (state, action) => {
      const index = state.photos.findIndex(photo => photo.id === action.payload.id)
      if (index !== -1) {
        state.photos[index] = { ...state.photos[index], ...action.payload }
      }
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    openLightbox: (state, action) => {
      state.lightboxImage = action.payload
    },
    closeLightbox: (state) => {
      state.lightboxImage = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const {
  addPhoto,
  removePhoto,
  updatePhoto,
  setSelectedCategory,
  openLightbox,
  closeLightbox,
  setLoading,
} = gallerySlice.actions
export default gallerySlice.reducer
