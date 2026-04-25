import { Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AdminAddress from "./pages/AdminAddress";
import AdminDarbarBookings from "./pages/AdminDarbarBookings";
import { AdminProtected } from "../components/ProtectedRoute";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import DonationSettingsManagement from "./components/DonationSettingsManagement";
import PageContentManagement from "./components/PageContentManagement";
import EventManagement from "./components/EventManagement";
import AnnouncementManagement from "./components/AnnouncementManagement";
import MarqueeManagement from "./components/MarqueeManagement";
import ScheduleManagement from "./components/ScheduleManagement";
import TimingsManagement from "./components/TimingsManagement";
import SpecialDaysManagement from "./components/SpecialDaysManagement";
import UserManagement from "./components/UserManagement";
import AdminPrivacyManagement from "./components/AdminPrivacyManagement";
import AdminTermsManagement from "./components/AdminTermsManagement";
import AdminCookieManagement from "./components/AdminCookieManagement";
import { Shield, FileText, Cookie } from "lucide-react";


const AdminRoutes = (
  <Route element={<AdminProtected />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="address" element={<AdminAddress />} />
      <Route path="darbar-bookings" element={<AdminDarbarBookings />} />
      <Route path="analytics" element={<AnalyticsDashboard />} />
      <Route path="donation-settings" element={<DonationSettingsManagement />} />
      <Route path="page-content" element={<PageContentManagement />} />
      <Route path="events" element={<EventManagement />} />
      <Route path="announcements" element={<AnnouncementManagement />} />
      <Route path="marquee" element={<MarqueeManagement />} />
      <Route path="schedules" element={<ScheduleManagement />} />
      <Route path="timings" element={<TimingsManagement />} />
      <Route path="special-days" element={<SpecialDaysManagement />} />
      <Route path="users" element={<UserManagement />} />
      
      {/* Legal Policies (Refactored) */}
      <Route path="manage-privacy" element={<AdminPrivacyManagement />} />
      <Route path="manage-terms" element={<AdminTermsManagement />} />
      <Route path="manage-cookie" element={<AdminCookieManagement />} />

      <Route path="*" element={<Dashboard />} />
    </Route>
  </Route>
);

export default AdminRoutes;