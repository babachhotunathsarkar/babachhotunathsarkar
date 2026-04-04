// src/admin/layouts/AdminLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Only here, not in Dashboard */}
      <div className={`fixed inset-y-0 left-0 z-40 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar />
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}