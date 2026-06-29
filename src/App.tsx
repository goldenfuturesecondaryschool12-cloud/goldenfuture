import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import Layout from './components/layout/Layout';
import ERPLayout from './components/erp/ERPLayout';
import ProtectedRoute from './components/erp/ProtectedRoute';
import ERPRedirect from './pages/erp/ERPRedirect';

// Public pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Academics from './pages/public/Academics';
import PrincipalMessage from './pages/public/PrincipalMessage';
import Admissions from './pages/public/Admissions';
import Facilities from './pages/public/Facilities';
import Teachers from './pages/public/Teachers';
import Gallery from './pages/public/Gallery';
import News from './pages/public/News';
import Notices from './pages/public/Notices';
import Events from './pages/public/Events';
import StudentCouncil from './pages/public/StudentCouncil';
import Election from './pages/public/Election';
import Downloads from './pages/public/Downloads';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';

// ERP
import Login from './pages/erp/Login';
import PlaceholderPage from './pages/erp/PlaceholderPage';
import TeacherManagement from './pages/erp/management/TeacherManagement';
import StudentManagement from './pages/erp/management/StudentManagement';
import ElectionManagement from './pages/erp/management/ElectionManagement';
import AdminStudentManagement from './pages/erp/management/AdminStudentManagement';
import SuperAdminDashboard from './pages/erp/dashboards/SuperAdminDashboard';
import AdminDashboard from './pages/erp/dashboards/AdminDashboard';
import PrincipalDashboard from './pages/erp/dashboards/PrincipalDashboard';
import TeacherDashboard from './pages/erp/dashboards/TeacherDashboard';
import StudentDashboard from './pages/erp/dashboards/StudentDashboard';
import ParentDashboard from './pages/erp/dashboards/ParentDashboard';
import StaffDashboard from './pages/erp/dashboards/StaffDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Website Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/principal-message" element={<PrincipalMessage />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/news" element={<News />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/events" element={<Events />} />
              <Route path="/student-council" element={<StudentCouncil />} />
              <Route path="/election" element={<Election />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* ERP Login */}
            <Route path="/login" element={<Login />} />

            {/* ERP Portal Routes */}
            <Route path="/erp" element={<ProtectedRoute><ERPLayout /></ProtectedRoute>}>
              <Route index element={<ERPRedirect />} />

              {/* Super Admin */}
              <Route path="superadmin" element={<ProtectedRoute allowedRoles={['superadmin']}><SuperAdminDashboard /></ProtectedRoute>} />
              <Route path="superadmin/users" element={<ProtectedRoute allowedRoles={['superadmin']}><PlaceholderPage title="User Management" description="Manage all system users here." /></ProtectedRoute>} />
              <Route path="superadmin/settings" element={<ProtectedRoute allowedRoles={['superadmin']}><PlaceholderPage title="System Settings" /></ProtectedRoute>} />
              <Route path="superadmin/logs" element={<ProtectedRoute allowedRoles={['superadmin']}><PlaceholderPage title="Audit Logs" /></ProtectedRoute>} />
              <Route path="superadmin/announcements" element={<ProtectedRoute allowedRoles={['superadmin']}><PlaceholderPage title="Announcements" /></ProtectedRoute>} />
              <Route path="superadmin/cms" element={<ProtectedRoute allowedRoles={['superadmin']}><PlaceholderPage title="Content Management System" /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AdminStudentManagement /></ProtectedRoute>} />
              <Route path="admin/parents" element={<ProtectedRoute allowedRoles={['admin']}><PlaceholderPage title="Parent Management" /></ProtectedRoute>} />
              <Route path="admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><PlaceholderPage title="Staff Management" /></ProtectedRoute>} />
              <Route path="admin/fees" element={<ProtectedRoute allowedRoles={['admin']}><PlaceholderPage title="Fee Management" /></ProtectedRoute>} />
              <Route path="admin/notices" element={<ProtectedRoute allowedRoles={['admin']}><PlaceholderPage title="Notice Management" /></ProtectedRoute>} />
              <Route path="admin/gallery" element={<ProtectedRoute allowedRoles={['admin']}><PlaceholderPage title="Gallery Management" /></ProtectedRoute>} />
              <Route path="admin/downloads" element={<ProtectedRoute allowedRoles={['admin']}><PlaceholderPage title="Downloads Management" /></ProtectedRoute>} />
              <Route path="admin/events" element={<ProtectedRoute allowedRoles={['admin']}><PlaceholderPage title="Events Management" /></ProtectedRoute>} />
              <Route path="admin/news" element={<ProtectedRoute allowedRoles={['admin']}><PlaceholderPage title="News Management" /></ProtectedRoute>} />
              <Route path="admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><PlaceholderPage title="Reports" /></ProtectedRoute>} />

              {/* Principal */}
              <Route path="principal" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalDashboard /></ProtectedRoute>} />
              <Route path="principal/teachers" element={<ProtectedRoute allowedRoles={['principal']}><TeacherManagement /></ProtectedRoute>} />
              <Route path="principal/students" element={<ProtectedRoute allowedRoles={['principal']}><StudentManagement /></ProtectedRoute>} />
              <Route path="principal/attendance" element={<ProtectedRoute allowedRoles={['principal']}><PlaceholderPage title="Attendance Overview" /></ProtectedRoute>} />
              <Route path="principal/results" element={<ProtectedRoute allowedRoles={['principal']}><PlaceholderPage title="Results Overview" /></ProtectedRoute>} />
              <Route path="principal/notices" element={<ProtectedRoute allowedRoles={['principal']}><PlaceholderPage title="Notice Management" /></ProtectedRoute>} />
              <Route path="principal/election" element={<ProtectedRoute allowedRoles={['principal']}><ElectionManagement /></ProtectedRoute>} />
              <Route path="principal/reports" element={<ProtectedRoute allowedRoles={['principal']}><PlaceholderPage title="Reports" /></ProtectedRoute>} />

              {/* Teacher */}
              <Route path="teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
              <Route path="teacher/classes" element={<ProtectedRoute allowedRoles={['teacher']}><PlaceholderPage title="My Classes" /></ProtectedRoute>} />
              <Route path="teacher/attendance" element={<ProtectedRoute allowedRoles={['teacher']}><PlaceholderPage title="Mark Attendance" /></ProtectedRoute>} />
              <Route path="teacher/homework" element={<ProtectedRoute allowedRoles={['teacher']}><PlaceholderPage title="Homework Management" /></ProtectedRoute>} />
              <Route path="teacher/assignments" element={<ProtectedRoute allowedRoles={['teacher']}><PlaceholderPage title="Assignment Management" /></ProtectedRoute>} />
              <Route path="teacher/results" element={<ProtectedRoute allowedRoles={['teacher']}><PlaceholderPage title="Enter Results" /></ProtectedRoute>} />
              <Route path="teacher/students" element={<ProtectedRoute allowedRoles={['teacher']}><StudentManagement /></ProtectedRoute>} />
              <Route path="teacher/notices" element={<ProtectedRoute allowedRoles={['teacher']}><PlaceholderPage title="Notices" /></ProtectedRoute>} />

              {/* Student */}
              <Route path="student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="student/profile" element={<ProtectedRoute allowedRoles={['student']}><PlaceholderPage title="My Profile" /></ProtectedRoute>} />
              <Route path="student/attendance" element={<ProtectedRoute allowedRoles={['student']}><PlaceholderPage title="My Attendance" /></ProtectedRoute>} />
              <Route path="student/homework" element={<ProtectedRoute allowedRoles={['student']}><PlaceholderPage title="My Homework" /></ProtectedRoute>} />
              <Route path="student/assignments" element={<ProtectedRoute allowedRoles={['student']}><PlaceholderPage title="My Assignments" /></ProtectedRoute>} />
              <Route path="student/results" element={<ProtectedRoute allowedRoles={['student']}><PlaceholderPage title="My Results" /></ProtectedRoute>} />
              <Route path="student/notices" element={<ProtectedRoute allowedRoles={['student']}><PlaceholderPage title="Notices" /></ProtectedRoute>} />
              <Route path="student/downloads" element={<ProtectedRoute allowedRoles={['student']}><PlaceholderPage title="Downloads" /></ProtectedRoute>} />

              {/* Parent */}
              <Route path="parent" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
              <Route path="parent/children" element={<ProtectedRoute allowedRoles={['parent']}><PlaceholderPage title="My Children" /></ProtectedRoute>} />
              <Route path="parent/attendance" element={<ProtectedRoute allowedRoles={['parent']}><PlaceholderPage title="Attendance Records" /></ProtectedRoute>} />
              <Route path="parent/results" element={<ProtectedRoute allowedRoles={['parent']}><PlaceholderPage title="Academic Results" /></ProtectedRoute>} />
              <Route path="parent/homework" element={<ProtectedRoute allowedRoles={['parent']}><PlaceholderPage title="Homework Tracker" /></ProtectedRoute>} />
              <Route path="parent/fees" element={<ProtectedRoute allowedRoles={['parent']}><PlaceholderPage title="Fee Status" /></ProtectedRoute>} />
              <Route path="parent/notices" element={<ProtectedRoute allowedRoles={['parent']}><PlaceholderPage title="Notices" /></ProtectedRoute>} />

              {/* Staff */}
              <Route path="staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
              <Route path="staff/profile" element={<ProtectedRoute allowedRoles={['staff']}><PlaceholderPage title="My Profile" /></ProtectedRoute>} />
              <Route path="staff/notices" element={<ProtectedRoute allowedRoles={['staff']}><PlaceholderPage title="Notices" /></ProtectedRoute>} />
              <Route path="staff/downloads" element={<ProtectedRoute allowedRoles={['staff']}><PlaceholderPage title="Downloads" /></ProtectedRoute>} />
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
