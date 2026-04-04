// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from './layouts/MainLayout'
import AdminLayout from './admin/layouts/AdminLayout'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Videos from './pages/Videos'
import Contact from './pages/Contact'
import Donate from './pages/Donate'
import Programs from './pages/Programs'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import NotificationPopup from './components/NotificationPopup'
import { ProtectedRoute, AdminProtected, UserProtected } from './components/ProtectedRoute'
import AdminRoutes from './admin/admin' 
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import Profile from './pages/Profile';
import Darshan from './pages/Darshan';
import DarbarBookingPage from './pages/DarbarBookingPage';
import UserDashboardPage from './pages/UserDashboardPage';
export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <NotificationPopup />
     
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/photos" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/darshan" element={<Darshan />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path ="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path ="/terms-conditions" element={<TermsConditions/>}/>
          <Route path ="/userDashboard" element={<UserDashboard/>}/>
          <Route path ="/darbar-booking" element={<DarbarBookingPage/>}/>
          <Route path ="/token-dashboard" element={<UserDashboardPage/>}/>
          <Route
            path="/profile"
            element={
            
                <Profile />
         
            }
          />
        </Route>
        
      
    {AdminRoutes}
      </Routes>
    </>
  )
}