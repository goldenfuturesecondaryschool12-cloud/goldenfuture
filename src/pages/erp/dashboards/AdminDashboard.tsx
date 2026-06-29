import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { GraduationCap, Users, Bell, CreditCard, Calendar, TrendingUp, Plus, FileText, ClipboardList, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import StatCard from '../../../components/erp/StatCard';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  reviewed: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-rose-100 text-rose-700',
};

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  const { data: studentCount = 0 } = useQuery({
    queryKey: ['student-count'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
      return snap.size;
    },
  });

  const { data: parentCount = 0 } = useQuery({
    queryKey: ['parent-count'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'parent')));
      return snap.size;
    },
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['admin-admission-applications'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'admission_applications'), orderBy('createdAt', 'desc'), limit(20)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
  });

  const { data: recentNotices = [] } = useQuery({
    queryKey: ['recent-notices-admin'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'notices'), where('isActive', '==', true), orderBy('publishedAt', 'desc'), limit(5)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });

  const pendingApplications = applications.filter((a: any) => a.status === 'pending').length;

  const stats = [
    { title: 'Total Students', value: studentCount, icon: GraduationCap, color: 'text-blue-700', bgColor: 'bg-blue-100' },
    { title: 'Total Parents', value: parentCount, icon: Users, color: 'text-green-700', bgColor: 'bg-green-100' },
    { title: 'Pending Admissions', value: pendingApplications, icon: ClipboardList, color: 'text-amber-700', bgColor: 'bg-amber-100' },
    { title: 'Active Notices', value: recentNotices.length, icon: Bell, color: 'text-rose-700', bgColor: 'bg-rose-100' },
  ];

  const updateStatus = async (appId: string, status: string) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'admission_applications', appId), { status });
      queryClient.invalidateQueries({ queryKey: ['admin-admission-applications'] });
      setSelectedApp(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      console.error('Failed to update application status', err);
    } finally {
      setUpdating(false);
    }
  };

  const classes = [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
    'Class 7 A', 'Class 7 B', 'Class 8 A', 'Class 8 B',
    'Class 9 A', 'Class 9 B', 'Class 10 A', 'Class 10 B',
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-secondary-900 mb-1">
          Welcome, {userProfile?.displayName || 'Admin'}
        </h1>
        <p className="text-secondary-500 text-sm">Manage students, parents, staff, and school operations.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Add New Student', icon: Plus, color: 'text-blue-600 bg-blue-50', to: '/erp/admin/students' },
              { label: 'Post a Notice', icon: Bell, color: 'text-amber-600 bg-amber-50', to: '/erp/admin/notices' },
              { label: 'Manage Gallery', icon: FileText, color: 'text-green-600 bg-green-50', to: '/erp/admin/gallery' },
              { label: 'Add Event', icon: Calendar, color: 'text-purple-600 bg-purple-50', to: '/erp/admin/events' },
              { label: 'Upload Download', icon: FileText, color: 'text-rose-600 bg-rose-50', to: '/erp/admin/downloads' },
              { label: 'View Reports', icon: TrendingUp, color: 'text-secondary-600 bg-secondary-50', to: '/erp/admin/reports' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors hover:opacity-80 ${action.color}`}
              >
                <action.icon size={17} />
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Admission Applications */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg text-secondary-900">Admission Applications</h2>
            <span className="text-xs text-secondary-400">{pendingApplications} pending</span>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-secondary-400">
              <ClipboardList size={32} className="mx-auto mb-2 text-secondary-200" />
              <p className="text-sm">No admission applications yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
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
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[app.status] || 'bg-secondary-100 text-secondary-600'}`}>
                      {app.status}
                    </span>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-600 transition-colors"
                      title="View details"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Classes Overview */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Classes</h2>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {classes.map((cls) => (
              <div key={cls} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-secondary-50 hover:bg-secondary-100 transition-colors cursor-default">
                <span className="text-sm font-medium text-secondary-700">{cls}</span>
                <span className="text-xs text-secondary-400">0 students</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6 lg:col-span-2">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Recent Notices</h2>
          {recentNotices.length === 0 ? (
            <div className="text-center py-8 text-secondary-400">
              <Bell size={32} className="mx-auto mb-2 text-secondary-200" />
              <p className="text-sm">No active notices</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotices.map((n: any) => (
                <div key={n.id} className="p-3 rounded-xl bg-secondary-50">
                  <div className="text-sm font-semibold text-secondary-900 line-clamp-2">{n.title}</div>
                  <span className="text-xs text-secondary-400 mt-1">{n.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedApp(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-secondary-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="font-heading font-bold text-xl text-secondary-900">
                  {selectedApp.studentFirstName} {selectedApp.studentMiddleName || ''} {selectedApp.studentLastName || ''}
                </h3>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full mt-1 inline-block ${statusColors[selectedApp.status] || 'bg-secondary-100 text-secondary-600'}`}>
                  {selectedApp.status}
                </span>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-secondary-400 hover:text-secondary-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-secondary-400 block text-xs">Date of Birth</span><span className="text-secondary-800 font-medium">{selectedApp.studentDob || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">Gender</span><span className="text-secondary-800 font-medium">{selectedApp.studentGender || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">Applying for Class</span><span className="text-secondary-800 font-medium">{selectedApp.applyingForClass || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">Previous School</span><span className="text-secondary-800 font-medium">{selectedApp.previousSchool || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">Father's Name</span><span className="text-secondary-800 font-medium">{selectedApp.fatherName || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">Father's Phone</span><span className="text-secondary-800 font-medium">{selectedApp.fatherPhone || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">Mother's Name</span><span className="text-secondary-800 font-medium">{selectedApp.motherName || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">Mother's Phone</span><span className="text-secondary-800 font-medium">{selectedApp.motherPhone || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">Guardian Email</span><span className="text-secondary-800 font-medium break-all">{selectedApp.guardianEmail || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">Nationality</span><span className="text-secondary-800 font-medium">{selectedApp.nationality || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">Blood Group</span><span className="text-secondary-800 font-medium">{selectedApp.bloodGroup || '—'}</span></div>
                <div><span className="text-secondary-400 block text-xs">How did they hear?</span><span className="text-secondary-800 font-medium">{selectedApp.howDidYouHear || '—'}</span></div>
              </div>
              <div><span className="text-secondary-400 block text-xs mb-1">Address</span><span className="text-secondary-800 text-sm">{selectedApp.address || '—'}</span></div>
              {selectedApp.additionalInfo && (
                <div><span className="text-secondary-400 block text-xs mb-1">Additional Info</span><span className="text-secondary-800 text-sm">{selectedApp.additionalInfo}</span></div>
              )}
            </div>
            <div className="p-6 border-t border-secondary-100 flex flex-wrap gap-2 sticky bottom-0 bg-white rounded-b-2xl">
              <button
                onClick={() => updateStatus(selectedApp.id, 'accepted')}
                disabled={updating}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <CheckCircle size={16} /> Accept
              </button>
              <button
                onClick={() => updateStatus(selectedApp.id, 'rejected')}
                disabled={updating}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <XCircle size={16} /> Reject
              </button>
              <button
                onClick={() => updateStatus(selectedApp.id, 'reviewed')}
                disabled={updating}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                Mark Reviewed
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                className="ml-auto border border-secondary-200 hover:bg-secondary-50 text-secondary-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
