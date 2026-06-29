import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { UserCheck, Clipboard, ClipboardList, Award, Bell, Download, User } from 'lucide-react';
import StatCard from '../../../components/erp/StatCard';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import type { StudentProfile } from '../../../types';

export default function StudentDashboard() {
  const { userProfile, currentUser } = useAuth();

  const { data: studentProfile } = useQuery({
    queryKey: ['student-profile', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) return null;
      const snap = await getDoc(doc(db, 'students', currentUser.uid));
      return snap.exists() ? snap.data() as StudentProfile : null;
    },
    enabled: !!currentUser?.uid,
  });

  const { data: homework = [] } = useQuery({
    queryKey: ['student-homework', userProfile?.uid],
    queryFn: async () => {
      if (!userProfile) return [];
      const sp = studentProfile || (await getDoc(doc(db, 'students', userProfile.uid))).data() as StudentProfile;
      if (!sp?.class) return [];
      const snap = await getDocs(query(collection(db, 'homework'), where('class', '==', sp.class), orderBy('assignedDate', 'desc'), limit(5)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    enabled: !!userProfile?.uid,
  });

  const { data: notices = [] } = useQuery({
    queryKey: ['notices-student'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'notices'), where('isActive', '==', true), orderBy('publishedAt', 'desc'), limit(3)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });

  const houseColors: Record<string, string> = {
    Red: 'bg-red-100 text-red-700 border-red-200',
    Blue: 'bg-blue-100 text-blue-700 border-blue-200',
    Green: 'bg-green-100 text-green-700 border-green-200',
    Yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  const stats = [
    { title: 'Attendance', value: '—', icon: UserCheck, color: 'text-green-700', bgColor: 'bg-green-100' },
    { title: 'Pending Homework', value: homework.length, icon: Clipboard, color: 'text-blue-700', bgColor: 'bg-blue-100' },
    { title: 'Assignments', value: '—', icon: ClipboardList, color: 'text-amber-700', bgColor: 'bg-amber-100' },
    { title: 'Results', value: '—', icon: Award, color: 'text-rose-700', bgColor: 'bg-rose-100' },
  ];

  return (
    <div>
      {/* Student identity card */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border-2 border-white/20 shrink-0">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <User size={36} className="text-white/60" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-bold text-2xl text-white mb-1">{userProfile?.displayName}</h1>
            <div className="flex flex-wrap items-center gap-3 text-primary-200 text-sm">
              {(studentProfile as any)?.admissionNumber && (
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">
                  Adm No: {(studentProfile as any).admissionNumber}
                </span>
              )}
              {(studentProfile as any)?.class && (
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">
                  {(studentProfile as any).class}{(studentProfile as any).section ? ` – ${(studentProfile as any).section}` : ''}
                </span>
              )}
              {(studentProfile as any)?.house && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${houseColors[(studentProfile as any).house] || 'bg-secondary-100 text-secondary-700 border-secondary-200'}`}>
                  {(studentProfile as any).house} House
                </span>
              )}
            </div>
          </div>
          <Link to="/erp/student/profile" className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0">
            <User size={13} /> View Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">My Portal</h2>
          <div className="space-y-2">
            {[
              { label: 'View Attendance', icon: UserCheck, to: '/erp/student/attendance', color: 'bg-green-50 text-green-700' },
              { label: 'My Homework', icon: Clipboard, to: '/erp/student/homework', color: 'bg-blue-50 text-blue-700' },
              { label: 'My Assignments', icon: ClipboardList, to: '/erp/student/assignments', color: 'bg-amber-50 text-amber-700' },
              { label: 'View Results', icon: Award, to: '/erp/student/results', color: 'bg-rose-50 text-rose-700' },
              { label: 'Notices', icon: Bell, to: '/erp/student/notices', color: 'bg-purple-50 text-purple-700' },
              { label: 'Downloads', icon: Download, to: '/erp/student/downloads', color: 'bg-secondary-50 text-secondary-700' },
            ].map((action) => (
              <Link key={action.label} to={action.to} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors hover:opacity-80 ${action.color}`}>
                <action.icon size={17} /> {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Homework */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Recent Homework</h2>
          {homework.length === 0 ? (
            <div className="text-center py-8 text-secondary-400">
              <Clipboard size={32} className="mx-auto mb-2 text-secondary-200" />
              <p className="text-sm">No homework assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {homework.map((hw: any) => (
                <div key={hw.id} className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-sm font-semibold text-secondary-900 line-clamp-1">{hw.title}</div>
                  <div className="text-xs text-secondary-500 mt-0.5">{hw.subject}</div>
                  <div className="text-xs text-rose-600 mt-1 font-medium">Due: {hw.dueDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notices */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">School Notices</h2>
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
