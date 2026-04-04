import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  templeInfo: {
    name: 'बाबा छोटू नाथ सरकार सेवा समिति',
    namePunjabi: 'ਬਾਬਾ ਛੋਟੂ ਨਾਥ ਸਰਕਾਰ ਸੇਵਾ ਸਮਿਤੀ',
    nameEnglish: 'Baba Chhotu Nath Sarkar Sewa Samiti',
    address: 'मुख्य बाजार, ग्राम पंचायत, जिला - भारत',
    addressPunjabi: 'ਮੁੱਖ ਬਾਜ਼ਾਰ, ਗ੍ਰਾਮ ਪੰਚਾਇਤ, ਜ਼ਿਲ੍ਹਾ - ਭਾਰਤ',
    addressEnglish: 'Main Market, Village Panchayat, District - India',
    phone: '+91 98765 43210',
    email: 'info@babachhotunath.org',
    timings: 'प्रातः 5:00 बजे से रात्रि 9:00 बजे तक',
    timingsPunjabi: 'ਸਵੇਰੇ 5:00 ਵਜੇ ਤੋਂ ਰਾਤ 9:00 ਵਜੇ ਤੱਕ',
    timingsEnglish: '5:00 AM to 9:00 PM',
  },
  socialLinks: {
    facebook: 'https://facebook.com/babachhotunath',
    instagram: 'https://instagram.com/babachhotunath',
    youtube: 'https://youtube.com/babachhotunath',
    twitter: 'https://twitter.com/babachhotunath',
  },
  donationInfo: {
    upiId: 'babachhotunath@upi',
    bankName: 'State Bank of India',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    accountName: 'Baba Chhotu Nath Sarkar Sewa Samiti',
  },
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateTempleInfo: (state, action) => {
      state.templeInfo = { ...state.templeInfo, ...action.payload }
    },
    updateSocialLinks: (state, action) => {
      state.socialLinks = { ...state.socialLinks, ...action.payload }
    },
    updateDonationInfo: (state, action) => {
      state.donationInfo = { ...state.donationInfo, ...action.payload }
    },
  },
})

export const { updateTempleInfo, updateSocialLinks, updateDonationInfo } = settingsSlice.actions
export default settingsSlice.reducer
