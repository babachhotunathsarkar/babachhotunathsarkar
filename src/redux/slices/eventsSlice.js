import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    {
      id: 1,
      title: 'नवरात्रि महोत्सव',
      titlePunjabi: 'ਨਵਰਾਤਰੀ ਮਹੋਤਸਵ',
      titleEnglish: 'Navratri Festival',
      description: 'नौ दिनों तक माता की विशेष पूजा अर्चना और भजन संध्या का आयोजन।',
      descriptionPunjabi: 'ਨੌਂ ਦਿਨਾਂ ਤੱਕ ਮਾਤਾ ਦੀ ਵਿਸ਼ੇਸ਼ ਪੂਜਾ ਅਰਚਨਾ ਅਤੇ ਭਜਨ ਸੰਧਿਆ ਦਾ ਆਯੋਜਨ।',
      descriptionEnglish: 'Nine days of special worship and evening bhajan sessions dedicated to the Goddess.',
      date: '2026-10-15',
      endDate: '2026-10-23',
      time: '06:00 AM - 10:00 PM',
      venue: 'मुख्य मंदिर परिसर',
      image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?w=800',
      isUpcoming: true,
    },
    {
      id: 2,
      title: 'दीपावली पूजन',
      titlePunjabi: 'ਦੀਪਾਵਲੀ ਪੂਜਨ',
      titleEnglish: 'Diwali Puja',
      description: 'दीपावली के शुभ अवसर पर विशेष लक्ष्मी पूजन और आतिशबाजी।',
      descriptionPunjabi: 'ਦੀਪਾਵਲੀ ਦੇ ਸ਼ੁਭ ਮੌਕੇ ਤੇ ਵਿਸ਼ੇਸ਼ ਲਕਸ਼ਮੀ ਪੂਜਨ ਅਤੇ ਆਤਿਸ਼ਬਾਜ਼ੀ।',
      descriptionEnglish: 'Special Lakshmi Puja and fireworks on the auspicious occasion of Diwali.',
      date: '2026-11-12',
      endDate: '2026-11-12',
      time: '05:00 PM - 11:00 PM',
      venue: 'मंदिर प्रांगण',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800',
      isUpcoming: true,
    },
    {
      id: 3,
      title: 'महाशिवरात्रि',
      titlePunjabi: 'ਮਹਾਸ਼ਿਵਰਾਤ੍ਰੀ',
      titleEnglish: 'Maha Shivaratri',
      description: 'भगवान शिव की विशेष आराधना, रात्रि जागरण और रुद्राभिषेक।',
      descriptionPunjabi: 'ਭਗਵਾਨ ਸ਼ਿਵ ਦੀ ਵਿਸ਼ੇਸ਼ ਆਰਾਧਨਾ, ਰਾਤ ਜਾਗਰਣ ਅਤੇ ਰੁਦ੍ਰਾਭਿਸ਼ੇਕ।',
      descriptionEnglish: 'Special worship of Lord Shiva, night vigil and Rudrabhishek.',
      date: '2027-02-26',
      endDate: '2027-02-27',
      time: 'All Night',
      venue: 'शिव मंदिर',
      image: 'https://images.unsplash.com/photo-1609941871666-5da8a26c5879?w=800',
      isUpcoming: true,
    },
  ],
  loading: false,
  error: null,
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.items.push({
        ...action.payload,
        id: Date.now(),
      })
    },
    updateEvent: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload }
      }
    },
    deleteEvent: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { addEvent, updateEvent, deleteEvent, setLoading } = eventsSlice.actions
export default eventsSlice.reducer
