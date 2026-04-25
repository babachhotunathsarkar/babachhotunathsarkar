// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

export const AdminProtected = () => {
  const { user, token, isLoading } = useSelector((state) => state.auth);

  // Fallback — Redux state nahi hai toh localStorage check karo
  const localToken = localStorage.getItem('token');
  const localUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const activeToken = token || localToken;
  const activeUser = user || localUser;

  if (isLoading) {
    return <Loader fullScreen={true} />;
  }

  if (!activeToken || !activeUser) {
    return <Navigate to="/login" replace />;
  }

  if (activeUser.role !== 'admin') {
    return <Navigate to="/userDashboard" replace />;
  }

  return <Outlet />;
};

export const UserProtected = () => {
  const { user, token, isLoading } = useSelector((state) => state.auth);

  const localToken = localStorage.getItem('token');
  const localUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const activeToken = token || localToken;
  const activeUser = user || localUser;

  if (isLoading) {
    return <Loader fullScreen={true} />;
  }

  if (!activeToken || !activeUser) {
    return <Navigate to="/login" replace />;
  }

  if (activeUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token, isLoading } = useSelector((state) => state.auth);

  const localToken = localStorage.getItem('token');
  const localUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const activeToken = token || localToken;
  const activeUser = user || localUser;

  if (isLoading) {
    return <Loader fullScreen={true} />;
  }

  if (!activeToken || !activeUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(activeUser.role)) {
    if (activeUser.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/userDashboard" replace />;
  }

  return <Outlet />;
};