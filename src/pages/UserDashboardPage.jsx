import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserLatestBooking } from '../redux/darbarBooking/darbarBookingSlice';

const UserDashboardPage = () => {
  const dispatch = useDispatch();
  const { latestUserBooking, loading, error } = useSelector((state) => state.darbarBooking);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if(phoneNumber) {
        dispatch(getUserLatestBooking(phoneNumber));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">User Token Dashboard</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <label className="block text-gray-700 text-sm font-bold mb-2">Search Booking By Phone Number</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number" 
              className="flex-1 appearance-none rounded w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                {error}
            </div>
        )}

        {latestUserBooking && (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Latest Booking Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Devotee Name</p>
                        <p className="font-medium text-lg">{latestUserBooking.devoteeName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Token Number</p>
                        <p className="font-bold text-2xl text-indigo-600">#{latestUserBooking.tokenNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Darbar Date</p>
                        <p className="font-medium">{new Date(latestUserBooking.darbarDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Confirmed
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">People</p>
                        <p className="font-medium">{latestUserBooking.numberOfPeople}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Booking Time</p>
                        <p className="font-medium">{latestUserBooking.bookingTime}</p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
