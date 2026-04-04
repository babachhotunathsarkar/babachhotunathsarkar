import { useSelector } from 'react-redux';
import { Mail, Phone, MapPin, Calendar, User as UserIcon } from 'lucide-react';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please login to view profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
              <span className="text-4xl font-bold text-orange-600">
                {(user.name || user.username || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
              <p className="text-orange-100 mt-1">Member since {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <UserIcon className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{user.name || user.username || 'Not provided'}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{user.email || 'Not provided'}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{user.address || 'Not provided'}</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <UserIcon className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-900 capitalize">{user.role || 'User'}</p>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-8 pt-6 border-t">
            <button className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}