import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    {
      id: 1,
      title: 'प्रातःकालीन आरती',
      titlePunjabi: 'ਸਵੇਰ ਦੀ ਆਰਤੀ',
      titleEnglish: 'Morning Aarti',
      description: 'बाबा छोटू नाथ सरकार की प्रातःकालीन आरती का सीधा प्रसारण।',
      youtubeId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400',
      category: 'aarti',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'नवरात्रि भजन संध्या',
      titlePunjabi: 'ਨਵਰਾਤਰੀ ਭਜਨ ਸੰਧਿਆ',
      titleEnglish: 'Navratri Bhajan Evening',
      description: 'नवरात्रि के अवसर पर विशेष भजन संध्या का आयोजन।',
      youtubeId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?w=400',
      category: 'bhajan',
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'मंदिर का इतिहास',
      titlePunjabi: 'ਮੰਦਰ ਦਾ ਇਤਿਹਾਸ',
      titleEnglish: 'Temple History',
      description: 'जानिए बाबा छोटू नाथ सरकार मंदिर का गौरवशाली इतिहास।',
      youtubeId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1545378953-61f11e04a53f?w=400',
      category: 'documentary',
      createdAt: new Date().toISOString(),
    },
  ],
  categories: ['all', 'aarti', 'bhajan', 'documentary', 'festival'],
  selectedCategory: 'all',
  loading: false,
}

const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    addVideo: (state, action) => {
      state.items.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      })
    },
    removeVideo: (state, action) => {
      state.items = state.items.filter(video => video.id !== action.payload)
    },
    updateVideo: (state, action) => {
      const index = state.items.findIndex(video => video.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload }
      }
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const {
  addVideo,
  removeVideo,
  updateVideo,
  setSelectedCategory,
  setLoading,
} = videosSlice.actions
export default videosSlice.reducer
