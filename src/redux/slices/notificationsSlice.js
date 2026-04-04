import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    {
      id: 1,
      title: 'नवरात्रि महोत्सव',
      message: 'नवरात्रि महोत्सव 15 अक्टूबर से शुरू हो रहा है। सभी भक्तों से निवेदन है कि समय पर पधारें।',
      type: 'event',
      read: false,
      logo: 'https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'दान अभियान',
      message: 'मंदिर जीर्णोद्धार के लिए दान अभियान चल रहा है। अपना योगदान दें।',
      type: 'donation',
      read: false,
      logo: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      createdAt: new Date().toISOString(),
    },
  ],
  showPopup: false,
  currentPopup: null,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        read: false,
      })
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    markAsRead: (state, action) => {
      const notification = state.items.find(item => item.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(item => {
        item.read = true
      })
    },
    showNotificationPopup: (state, action) => {
      state.showPopup = true
      state.currentPopup = action.payload
    },
    hideNotificationPopup: (state) => {
      state.showPopup = false
      state.currentPopup = null
    },
    updateNotification: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload }
      }
    },
  },
})

export const {
  addNotification,
  removeNotification,
  markAsRead,
  markAllAsRead,
  showNotificationPopup,
  hideNotificationPopup,
  updateNotification,
} = notificationsSlice.actions
export default notificationsSlice.reducer
