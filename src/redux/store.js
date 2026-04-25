import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import notificationsReducer from './slices/notificationsSlice'
import eventsReducer from './events/eventSlice'
import galleryReducer from './slices/gallerySlice'
import videosReducer from './videos/videoSlice'
import liveUpdatesReducer from './slices/liveUpdatesSlice'
import settingsReducer from './slices/settingsSlice'
import imageReducer from './images/imageSlice'
import adminUserReducer from './adminUsers/adminUserSlice'
import userReducer from './users/userSlice'
import announcementReducer from './announcements/announcementSlice';
import notificationReducer from './notifications/notificationSlice';
import addressReducer from './address/addressSlice';
import timingReducer from './timing/timingSlice';
import scheduleReducer from './schedule/scheduleSlice';
import specialDayReducer from './specialDay/specialDaySlice';
import darbarBookingReducer from './darbarBooking/darbarBookingSlice';
import marqueeReducer from './marquee/marqueeSlice';
import contactReducer from './contact/contactSlice';
import appointmentReducer from './appointment/appointmentSlice';
import donationSettingsReducer from './donationSettings/donationSettingsSlice';
import pageContentReducer from './pageContent/pageContentSlice';
import analyticsReducer from './analytics/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    events: eventsReducer,
    gallery: galleryReducer,
    videos: videosReducer,
    liveUpdates: liveUpdatesReducer,
    settings: settingsReducer,
    images: imageReducer,
    adminUsers: adminUserReducer,
    user: userReducer,
    announcements: announcementReducer,
    address: addressReducer,
    schedule: scheduleReducer,
    timing: timingReducer,
    specialDay: specialDayReducer,
    darbarBooking: darbarBookingReducer,
    marquee: marqueeReducer,
    contact: contactReducer,
    appointments: appointmentReducer,
    donationSettings: donationSettingsReducer,
    pageContent: pageContentReducer,
    analytics: analyticsReducer,
  },
})
