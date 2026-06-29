import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Users, GraduationCap, Shield, Settings, Bell, FileText, Activity, ClipboardList, Clock } from 'lucide-react';
import StatCard from '../../../components/erp/StatCard';
import { useAuth } from '../../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const roleColors: Record<string, string> = {
  superadmin: 'bg-purple-600',
  admin: 'bg-blue-600',
  principal: 'bg-amber-600',
  teacher: 'bg-green-600',
  student: 'bg-cyan-600',
  parent: 'bg-rose-600',
  staff: 'bg-secondary-600',
};

export default function SuperAdminDashboard() {
  const { userProfile } = useAuth();

  const { data: userCounts = {} } = useQuery({
    queryKey: ['user-counts'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'users'));
      const counts: Record<string, number> = {};
      snap.forEach(d => {
        const role = d.data().role;
        counts[role] = (counts[role] || 0) + 1;
      });
      return counts;
    },
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['recent-admissions-superadmin'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'admission_applications'), orderBy('createdAt', 'desc'), limit(5)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
  });

  const totalUsers = Object.values(userCounts).reduce((a, b) => a + b, 0);
  const pendingApplications = applications.filter((a: any) => a.status === 'pending').length;

  const stats = [
    { title: 'Total Users', value: totalUsers || 0, icon: Users, color: 'text-blue-700', bgColor: 'bg-blue-100' },
    { title: 'Teachers', value: userCounts.teacher || 0, icon: GraduationCap, color: 'text-green-700', bgColor: 'bg-green-100' },
    { title: 'Students', value: userCounts.student || 0, icon: GraduationCap, color: 'text-cyan-700', bgColor: 'bg-cyan-100' },
    { title: 'Pending Admissions', value: pendingApplications, icon: ClipboardList, color: 'text-amber-700', bgColor: 'bg-amber-100' },
  ];

  const roles = [
    { role: 'admin', label: 'Admins', count: userCounts.admin || 0 },
    { role: 'principal', label: 'Principals', count: userCounts.principal || 0 },
    { role: 'teacher', label: 'Teachers', count: userCounts.teacher || 0 },
    { role: 'student', label: 'Students', count: userCounts.student || 0 },
    { role: 'parent', label: 'Parents', count: userCounts.parent || 0 },
    { role: 'staff', label: 'Staff', count: userCounts.staff || 0 },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-secondary-900 mb-1">
          Welcome, {userProfile?.displayName || 'Super Admin'}
        </h1>
        <p className="text-secondary-500 text-sm">Here's an overview of the entire school management system.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Role Breakdown */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Users by Role</h2>
          <div className="space-y-3">
            {roles.map(({ role, label, count }) => {
              const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
              return (
                <div key={role}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${roleColors[role]}`} />
                      <span className="text-sm font-medium text-secondary-700">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-secondary-900">{count}</span>
                  </div>
                  <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className={`h-full rounded-full ${roleColors[role]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Manage Users', icon: Users, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100', to: '/erp/superadmin/users' },
              { label: 'System Settings', icon: Settings, color: 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100', to: '/erp/superadmin/settings' },
              { label: 'Announcements', icon: Bell, color: 'bg-amber-50 text-amber-700 hover:bg-amber-100', to: '/erp/superadmin/announcements' },
              { label: 'CMS', icon: FileText, color: 'bg-green-50 text-green-700 hover:bg-green-100', to: '/erp/superadmin/cms' },
              { label: 'Audit Logs', icon: Activity, color: 'bg-rose-50 text-rose-700 hover:bg-rose-100', to: '/erp/superadmin/logs' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-sm font-medium transition-colors ${action.color}`}
              >
                <action.icon size={22} />
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Admission Applications */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg text-secondary-900">Recent Admission Applications</h2>
            <span className="text-xs text-secondary-400">{applications.length} recent</span>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-secondary-400">
              <ClipboardList size={32} className="mx-auto mb-2 text-secondary-200" />
              <p className="text-sm">No admission applications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {applications.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary-50 hover:bg-secondary-100 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                      <GraduationCap size={17} className="text-primary-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-secondary-900 truncate">
                        {app.studentFirstName} {app.studentLastName || ''}
                      </div>
                      <div className="text-xs text-secondary-500 flex items-center gap-2">
                        <span>{app.applyingForClass}</span>
                        {app.createdAt?.toDate && (
                          <span className="flex items-center gap-0.5">
                            <Clock size={11} /> {new Date(app.createdAt.toDate()).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                    app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    app.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                    'bg-secondary-100 text-secondary-600'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
