import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { GraduationCap, Clipboard, ClipboardList, UserCheck, Award, Bell, Plus, Users } from 'lucide-react';
import StatCard from '../../../components/erp/StatCard';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const { userProfile } = useAuth();

  const { data: homework = [] } = useQuery({
    queryKey: ['teacher-homework', userProfile?.uid],
    queryFn: async () => {
      if (!userProfile?.uid) return [];
      const snap = await getDocs(query(collection(db, 'homework'), where('assignedBy', '==', userProfile.uid), orderBy('assignedDate', 'desc'), limit(5)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    enabled: !!userProfile?.uid,
  });

  const { data: notices = [] } = useQuery({
    queryKey: ['notices-teacher'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'notices'), where('isActive', '==', true), orderBy('publishedAt', 'desc'), limit(3)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });

  const { data: studentCount = 0 } = useQuery({
    queryKey: ['student-count-teacher'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
      return snap.size;
    },
  });

  const stats = [
    { title: 'My Students', value: studentCount, icon: Users, color: 'text-blue-700', bgColor: 'bg-blue-100' },
    { title: 'Homework Assigned', value: homework.length, icon: Clipboard, color: 'text-green-700', bgColor: 'bg-green-100' },
    { title: 'Assignments', value: '—', icon: ClipboardList, color: 'text-amber-700', bgColor: 'bg-amber-100' },
    { title: 'Attendance Marked', value: '—', icon: UserCheck, color: 'text-rose-700', bgColor: 'bg-rose-100' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-secondary-900 mb-1">
          Welcome, {userProfile?.displayName || 'Teacher'}
        </h1>
        <p className="text-secondary-500 text-sm">Manage your classes, homework, attendance, and student results.</p>
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
              { label: 'Create Student Account', icon: Plus, to: '/erp/teacher/students', color: 'bg-cyan-50 text-cyan-700' },
              { label: 'Mark Attendance', icon: UserCheck, to: '/erp/teacher/attendance', color: 'bg-blue-50 text-blue-700' },
              { label: 'Assign Homework', icon: Plus, to: '/erp/teacher/homework', color: 'bg-green-50 text-green-700' },
              { label: 'Create Assignment', icon: ClipboardList, to: '/erp/teacher/assignments', color: 'bg-amber-50 text-amber-700' },
              { label: 'Enter Results', icon: Award, to: '/erp/teacher/results', color: 'bg-rose-50 text-rose-700' },
              { label: 'View Notices', icon: Bell, to: '/erp/teacher/notices', color: 'bg-secondary-50 text-secondary-700' },
            ].map((action) => (
              <Link key={action.label} to={action.to} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors hover:opacity-80 ${action.color}`}>
                <action.icon size={17} /> {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Homework */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Recent Homework</h2>
          {homework.length === 0 ? (
            <div className="text-center py-8 text-secondary-400">
              <Clipboard size={32} className="mx-auto mb-2 text-secondary-200" />
              <p className="text-sm">No homework assigned yet</p>
              <Link to="/erp/teacher/homework" className="mt-3 text-primary-600 hover:text-primary-800 text-xs font-medium transition-colors">
                Assign homework →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {homework.map((hw: any) => (
                <div key={hw.id} className="p-3 rounded-xl bg-secondary-50">
                  <div className="text-sm font-semibold text-secondary-900 line-clamp-1">{hw.title}</div>
                  <div className="text-xs text-secondary-500 mt-0.5">{hw.subject} · Due: {hw.dueDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notices */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Notices</h2>
          {notices.length === 0 ? (
            <div className="text-center py-8 text-secondary-400">
              <Bell size={32} className="mx-auto mb-2 text-secondary-200" />
              <p className="text-sm">No active notices</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((n: any) => (
                <div key={n.id} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="text-sm font-semibold text-secondary-900 line-clamp-2">{n.title}</div>
                  <span className="text-xs text-amber-600 font-medium mt-1">{n.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
