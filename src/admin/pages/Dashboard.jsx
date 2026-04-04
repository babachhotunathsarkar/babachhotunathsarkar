// src/admin/pages/Dashboard.jsx
import { Routes, Route } from 'react-router-dom';

import UserManagement from "../components/UserManagement";
import UploadImages from '../components/UploadImages';
import UploadVideos from '../components/UploadVideos';
import MarqueeManagement from '../components/MarqueeManagement';
import AnnouncementManagement from '../components/AnnouncementManagement';  
import ScheduleManagement from '../components/ScheduleManagement';
import TimingsManagement from '../components/TimingsManagement';
import SpecialDaysManagement from '../components/SpecialDaysManagement';

// Dashboard Home Component
const DashboardHome = () => {
  return (
    <div className="p-6">
      <UserManagement />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/marquee" element={<MarqueeManagement />} />
        <Route path="/upload-images" element={<UploadImages />} />
        <Route path="/upload-videos" element={<UploadVideos />} />
        <Route path="/announcements" element={<AnnouncementManagement />} />
        <Route path="/schedules" element={<ScheduleManagement />} />
        <Route path="/timings" element={<TimingsManagement />} />
        <Route path="/special-days" element={<SpecialDaysManagement />} />
      </Routes>
    </div>
  );
};

export default Dashboard;