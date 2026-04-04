import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    {
      id: 1,
      text: 'आज की आरती का समय: प्रातः 5:30 बजे और सायं 7:00 बजे',
      textPunjabi: 'ਅੱਜ ਦੀ ਆਰਤੀ ਦਾ ਸਮਾਂ: ਸਵੇਰੇ 5:30 ਵਜੇ ਅਤੇ ਸ਼ਾਮ 7:00 ਵਜੇ',
      textEnglish: "Today's Aarti timings: Morning 5:30 AM and Evening 7:00 PM",
      priority: 'high',
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      text: 'नवरात्रि महोत्सव की तैयारियां जोरों पर हैं',
      textPunjabi: 'ਨਵਰਾਤਰੀ ਮਹੋਤਸਵ ਦੀਆਂ ਤਿਆਰੀਆਂ ਜ਼ੋਰਾਂ ਤੇ ਹਨ',
      textEnglish: 'Preparations for Navratri festival are in full swing',
      priority: 'normal',
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      text: 'प्रसाद वितरण दोपहर 12 बजे से शुरू होगा',
      textPunjabi: 'ਪ੍ਰਸਾਦ ਵੰਡ ਦੁਪਹਿਰ 12 ਵਜੇ ਤੋਂ ਸ਼ੁਰੂ ਹੋਵੇਗੀ',
      textEnglish: 'Prasad distribution will start from 12 noon',
      priority: 'normal',
      active: true,
      createdAt: new Date().toISOString(),
    },
  ],
  marqueeText: [
    'जय बाबा छोटू नाथ सरकार!',
    'सभी भक्तों का हार्दिक स्वागत है।',
    'मंदिर खुलने का समय: प्रातः 5:00 बजे से रात्रि 9:00 बजे तक।',
    'दान करें, पुण्य कमाएं।',
  ],
  loading: false,
}

const liveUpdatesSlice = createSlice({
  name: 'liveUpdates',
  initialState,
  reducers: {
    addUpdate: (state, action) => {
      state.items.unshift({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        active: true,
      })
    },
    removeUpdate: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    updateLiveUpdate: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload }
      }
    },
    toggleUpdateActive: (state, action) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        item.active = !item.active
      }
    },
    updateMarqueeText: (state, action) => {
      state.marqueeText = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const {
  addUpdate,
  removeUpdate,
  updateLiveUpdate,
  toggleUpdateActive,
  updateMarqueeText,
  setLoading,
} = liveUpdatesSlice.actions
export default liveUpdatesSlice.reducer
