import { Routes, Route } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Home from '@/pages/Home';
import Blogs from '@/pages/Blogs';
import BlogDetail from '@/pages/BlogDetail';
import Journey from '@/pages/Journey';
import Acadex from '@/pages/Acadex';
import Connect from '@/pages/Connect';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminBlogs from '@/pages/AdminBlogs';
import AdminJourney from '@/pages/AdminJourney';
import AdminReels from '@/pages/AdminReels';
import AdminMessages from '@/pages/AdminMessages';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/acadex" element={<Acadex />} />
        <Route path="/connect" element={<Connect />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="reels" element={<AdminReels />} />
          <Route path="journey" element={<AdminJourney />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
