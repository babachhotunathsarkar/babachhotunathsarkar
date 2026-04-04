import { Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AdminAddress from "./pages/AdminAddress";
import AdminDarbarBookings from "./pages/AdminDarbarBookings";
import { AdminProtected } from "../components/ProtectedRoute";

const AdminRoutes = (
  <Route element={<AdminProtected />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="address" element={<AdminAddress />} />
      <Route path="darbar-bookings" element={<AdminDarbarBookings />} />
      <Route path="*" element={<Dashboard />} />
    </Route>
  </Route>
);

export default AdminRoutes;