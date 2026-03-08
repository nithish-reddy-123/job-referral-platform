import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/slices/authSlice';
import { connectSocket, disconnectSocket } from './services/socket';

// Layout
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import JobList from './pages/jobs/JobList';
import JobDetail from './pages/jobs/JobDetail';
import Referrals from './pages/referrals/Referrals';
import Messages from './pages/messages/Messages';
import Profile from './pages/profile/Profile';
import Companies from './pages/companies/Companies';
import CompanyDetail from './pages/companies/CompanyDetail';
import Notifications from './pages/notifications/Notifications';
import AdminDashboard from './pages/admin/AdminDashboard';
import PostJob from './pages/jobs/PostJob';
import MyJobs from './pages/jobs/MyJobs';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      connectSocket(user._id);
    }
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <LoadingSpinner size="xl" className="min-h-screen" />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="jobs" element={<JobList />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="companies" element={<Companies />} />
        <Route path="companies/:slug" element={<CompanyDetail />} />

        {/* Authenticated routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="referrals" element={<Referrals />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Referrer routes */}
        <Route element={<ProtectedRoute allowedRoles={['referrer', 'admin']} />}>
          <Route path="post-job" element={<PostJob />} />
          <Route path="my-jobs" element={<MyJobs />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <div className="text-center py-20">
              <h1 className="text-6xl font-bold text-gray-200">404</h1>
              <p className="text-gray-500 mt-4">Page not found</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
