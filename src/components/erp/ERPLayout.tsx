import { useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, LogOut, Home, Users, GraduationCap, BookOpen,
  Bell, FileText, BarChart2, Settings, ChevronDown, Shield,
  User, Calendar, Clipboard, Award, Download, Vote,
  MessageSquare, CreditCard, UserCheck, ClipboardList
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

const roleMenus: Record<UserRole, { label: string; icon: React.ElementType; to: string }[]> = {
  superadmin: [
    { label: 'Dashboard', icon: Home, to: '/erp/superadmin' },
    { label: 'All Users', icon: Users, to: '/erp/superadmin/users' },
    { label: 'System Settings', icon: Settings, to: '/erp/superadmin/settings' },
    { label: 'Audit Logs', icon: ClipboardList, to: '/erp/superadmin/logs' },
    { label: 'Announcements', icon: Bell, to: '/erp/superadmin/announcements' },
    { label: 'CMS', icon: FileText, to: '/erp/superadmin/cms' },
  ],
  admin: [
    { label: 'Dashboard', icon: Home, to: '/erp/admin' },
    { label: 'Students', icon: GraduationCap, to: '/erp/admin/students' },
    { label: 'Parents', icon: Users, to: '/erp/admin/parents' },
    { label: 'Staff', icon: UserCheck, to: '/erp/admin/staff' },
    { label: 'Fees', icon: CreditCard, to: '/erp/admin/fees' },
    { label: 'Notices', icon: Bell, to: '/erp/admin/notices' },
    { label: 'Gallery', icon: FileText, to: '/erp/admin/gallery' },
    { label: 'Downloads', icon: Download, to: '/erp/admin/downloads' },
    { label: 'Events', icon: Calendar, to: '/erp/admin/events' },
    { label: 'News', icon: MessageSquare, to: '/erp/admin/news' },
    { label: 'Reports', icon: BarChart2, to: '/erp/admin/reports' },
  ],
  principal: [
    { label: 'Dashboard', icon: Home, to: '/erp/principal' },
    { label: 'Teachers', icon: Users, to: '/erp/principal/teachers' },
    { label: 'Students', icon: GraduationCap, to: '/erp/principal/students' },
    { label: 'Attendance', icon: UserCheck, to: '/erp/principal/attendance' },
    { label: 'Results', icon: Award, to: '/erp/principal/results' },
    { label: 'Notices', icon: Bell, to: '/erp/principal/notices' },
    { label: 'Election', icon: Vote, to: '/erp/principal/election' },
    { label: 'Reports', icon: BarChart2, to: '/erp/principal/reports' },
  ],
  teacher: [
    { label: 'Dashboard', icon: Home, to: '/erp/teacher' },
    { label: 'My Classes', icon: BookOpen, to: '/erp/teacher/classes' },
    { label: 'Attendance', icon: UserCheck, to: '/erp/teacher/attendance' },
    { label: 'Homework', icon: Clipboard, to: '/erp/teacher/homework' },
    { label: 'Assignments', icon: ClipboardList, to: '/erp/teacher/assignments' },
    { label: 'Results', icon: Award, to: '/erp/teacher/results' },
    { label: 'Students', icon: GraduationCap, to: '/erp/teacher/students' },
    { label: 'Notices', icon: Bell, to: '/erp/teacher/notices' },
  ],
  student: [
    { label: 'Dashboard', icon: Home, to: '/erp/student' },
    { label: 'My Profile', icon: User, to: '/erp/student/profile' },
    { label: 'Attendance', icon: UserCheck, to: '/erp/student/attendance' },
    { label: 'Homework', icon: Clipboard, to: '/erp/student/homework' },
    { label: 'Assignments', icon: ClipboardList, to: '/erp/student/assignments' },
    { label: 'Results', icon: Award, to: '/erp/student/results' },
    { label: 'Notices', icon: Bell, to: '/erp/student/notices' },
    { label: 'Downloads', icon: Download, to: '/erp/student/downloads' },
  ],
  parent: [
    { label: 'Dashboard', icon: Home, to: '/erp/parent' },
    { label: 'My Children', icon: GraduationCap, to: '/erp/parent/children' },
    { label: 'Attendance', icon: UserCheck, to: '/erp/parent/attendance' },
    { label: 'Results', icon: Award, to: '/erp/parent/results' },
    { label: 'Homework', icon: Clipboard, to: '/erp/parent/homework' },
    { label: 'Fees', icon: CreditCard, to: '/erp/parent/fees' },
    { label: 'Notices', icon: Bell, to: '/erp/parent/notices' },
  ],
  staff: [
    { label: 'Dashboard', icon: Home, to: '/erp/staff' },
    { label: 'My Profile', icon: User, to: '/erp/staff/profile' },
    { label: 'Notices', icon: Bell, to: '/erp/staff/notices' },
    { label: 'Downloads', icon: Download, to: '/erp/staff/downloads' },
  ],
};

const roleColors: Record<UserRole, string> = {
  superadmin: 'bg-purple-600',
  admin: 'bg-blue-600',
  principal: 'bg-amber-600',
  teacher: 'bg-green-600',
  student: 'bg-cyan-600',
  parent: 'bg-rose-600',
  staff: 'bg-secondary-600',
};

const roleLabels: Record<UserRole, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  principal: 'Principal',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
  staff: 'Staff',
};

export default function ERPLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userProfile, role, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Show spinner while auth/profile is loading — prevents blank white page.
  // If auth is done but there's still no profile, send back to login rather
  // than spinning forever (AuthContext always sets a fallback profile, so
  // reaching this branch means the user is effectively signed out).
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/school_logo.jpg"
            alt="Golden Future Secondary School"
            className="w-16 h-16 rounded-full object-cover border-2 border-primary-200 mx-auto mb-5 shadow-md"
          />
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary-500 text-sm font-medium">Loading your portal...</p>
          <p className="text-secondary-400 text-xs mt-1">Golden Future Secondary School</p>
        </div>
      </div>
    );
  }

  if (!role || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  const menuItems = roleMenus[role] || [];
  const roleColor = roleColors[role];
  const roleLabel = roleLabels[role];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? 'w-72' : 'w-64'} bg-primary-950 text-white`}>
      {/* Logo */}
      <div className="p-5 border-b border-primary-800">
        <Link to="/" className="flex items-center gap-3">
          <img src="/school_logo.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover border border-gold-400" />
          <div>
            <div className="font-heading font-bold text-sm text-white leading-tight">Golden Future</div>
            <div className="text-primary-400 text-xs">Secondary School</div>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-primary-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${roleColor} rounded-xl flex items-center justify-center shrink-0`}>
            <Shield size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{userProfile.displayName || userProfile.email}</div>
            <div className={`text-xs font-medium mt-0.5 px-2 py-0.5 rounded-full inline-block ${roleColor}/20 text-white/80`}>
              {roleLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 3}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-primary-300 hover:text-white hover:bg-white/8'
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-primary-800 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-300 hover:text-white hover:bg-white/8 transition-all"
        >
          <Home size={17} /> Public Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-secondary-100 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-heading font-bold text-secondary-900 text-base leading-tight">
                {roleLabel} Portal
              </h1>
              <p className="text-secondary-400 text-xs">Golden Future Secondary School</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-secondary-500 hover:bg-secondary-100 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 bg-secondary-50 border border-secondary-200 rounded-xl px-3 py-2 cursor-default">
              <div className={`w-7 h-7 ${roleColor} rounded-lg flex items-center justify-center`}>
                <Shield size={14} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-secondary-800 leading-none">{userProfile.displayName?.split(' ')[0] || 'User'}</div>
                <div className="text-xs text-secondary-400 leading-none mt-0.5">{roleLabel}</div>
              </div>
              <ChevronDown size={14} className="text-secondary-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
