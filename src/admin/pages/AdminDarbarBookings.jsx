import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookingsAdmin, deleteBookingAdmin, resetTokensAdmin } from '../../redux/darbarBooking/darbarBookingSlice';

const AdminDarbarBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error, successMessage } = useSelector((state) => state.darbarBooking);
    const [dateFilter, setDateFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getAllBookingsAdmin(dateFilter));
    }, [dispatch, dateFilter]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            dispatch(deleteBookingAdmin(id));
        }
    };

    const handleResetTokens = () => {
        if (window.confirm("Are you sure you want to reset tokens for the upcoming Sunday Darbar? Sequence will restart from 1.")) {
            dispatch(resetTokensAdmin());
        }
    };

    const filteredBookings = bookings.filter(b => 
        b.devoteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phoneNumber.includes(searchTerm) ||
        b.tokenNumber.toString().includes(searchTerm)
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Darbar Bookings Admin</h1>
                <button 
                    onClick={handleResetTokens}
                    className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                >
                    Reset Tokens Sequence
                </button>
            </div>

            {successMessage && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {successMessage}
                </div>
            )}
            
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input 
                        type="text" 
                        placeholder="Search by name, phone, or token..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
                    <input 
                        type="date" 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devotee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>}
                            {!loading && filteredBookings.length === 0 && (
                                <tr><td colSpan="7" className="text-center py-4 text-gray-500">No bookings found</td></tr>
                            )}
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">#{booking.tokenNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.devoteeName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.city}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.numberOfPeople}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(booking.darbarDate).toLocaleDateString()}<br/>
                                        <span className="text-xs text-gray-400">{booking.bookingTime}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleDelete(booking._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDarbarBookings;
