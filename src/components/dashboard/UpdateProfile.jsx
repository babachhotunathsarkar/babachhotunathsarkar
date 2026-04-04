import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Settings, User, Phone, MapPin, Camera, CheckCircle, Loader2 } from 'lucide-react'
import { updateUserProfile, resetUserState } from '../../redux/users/userSlice'
import { toast } from 'react-toastify'

export default function UpdateProfile() {
  const dispatch = useDispatch()
  const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.user)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  // ── Pre-fill form whenever user data changes ──────────────────────────
  useEffect(() => {
    if (user) {
      setForm({
        name:    user.name    || '',
        phone:   user.phone   || '',
        address: user.address || '',
      })
      // Show existing profile image
      if (user.profileImage) setPreviewImage(user.profileImage)
    }
  }, [user])

  // ── Toast on success / error ──────────────────────────────────────────
  useEffect(() => {
    if (isSuccess) {
      toast.success('Profile updated successfully!')
      dispatch(resetUserState())
    }
    if (isError && message) {
      toast.error(message || 'Failed to update profile.')
      dispatch(resetUserState())
    }
  }, [isSuccess, isError, message, dispatch])

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB')
      return
    }
    setSelectedFile(file)
    setPreviewImage(URL.createObjectURL(file))
  }

 const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
        toast.error('Name is required')
        return
    }

    const formData = new FormData()
    formData.append('name', form.name.trim())
    formData.append('phone', form.phone.trim())
    formData.append('address', form.address.trim())
    
    if (selectedFile) {
        formData.append('profileImage', selectedFile)
    }

    dispatch(updateUserProfile(formData))
}

  const getInitial = () => (user?.name || 'U').charAt(0).toUpperCase()

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-xl">
      <h2 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
        <Settings className="w-5 h-5 text-orange-500" />
        Update Profile
      </h2>
      <p className="text-gray-400 text-sm mb-6">Manage your account settings and profile information</p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Avatar + image change ── */}
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-orange-100
                            flex items-center justify-center border-4 border-orange-200">
              {previewImage
                ? <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                : <span className="text-orange-600 font-bold text-2xl">{getInitial()}</span>
              }
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-orange-500
                         hover:bg-orange-600 flex items-center justify-center shadow-md transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          <div>
            <p className="font-semibold text-gray-700 text-sm">{user?.name || 'User'}</p>
            <p className="text-gray-400 text-xs mt-0.5">{user?.email}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-orange-500 text-xs font-medium hover:underline mt-1 block"
            >
              Change Photo
            </button>
            <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG or WebP. Max 2MB.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* ── Name ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" name="name" value={form.name} onChange={handleChange} required
              placeholder="Enter your full name"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* ── Email (read-only) ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email" value={user?.email || ''} disabled
            className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50 rounded-xl
                       text-sm text-gray-400 cursor-not-allowed"
          />
          <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed. Please contact support if needed.</p>
        </div>

        {/* ── Phone ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel" name="phone" value={form.phone} onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* ── Address ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              name="address" value={form.address} onChange={handleChange} rows={3}
              placeholder="Enter your full address"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* ── Submit ── */}
        <button
          type="submit" disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300
                     text-white font-semibold py-3 rounded-xl transition-colors shadow-md
                     flex items-center justify-center gap-2"
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
            : <><CheckCircle className="w-4 h-4" />Save Changes</>
          }
        </button>
      </form>
    </div>
  )
}