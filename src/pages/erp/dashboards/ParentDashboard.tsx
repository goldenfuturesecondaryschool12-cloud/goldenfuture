import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { GraduationCap, UserCheck, Award, Clipboard, CreditCard, Bell } from 'lucide-react';
import StatCard from '../../../components/erp/StatCard';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function ParentDashboard() {
  const { userProfile } = useAuth();

  const { data: notices = [] } = useQuery({
    queryKey: ['notices-parent'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'notices'), where('isActive', '==', true), orderBy('publishedAt', 'desc'), limit(5)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });

  const stats = [
    { title: 'Children', value: '—', icon: GraduationCap, color: 'text-blue-700', bgColor: 'bg-blue-100' },
    { title: 'Attendance', value: '—', icon: UserCheck, color: 'text-green-700', bgColor: 'bg-green-100' },
    { title: 'Results', value: '—', icon: Award, color: 'text-amber-700', bgColor: 'bg-amber-100' },
    { title: 'Pending Fees', value: '—', icon: CreditCard, color: 'text-rose-700', bgColor: 'bg-rose-100' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-secondary-900 mb-1">
          Welcome, {userProfile?.displayName || 'Parent'}
        </h1>
        <p className="text-secondary-500 text-sm">Monitor your child's academic progress, attendance, and school updates.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Parent Portal</h2>
          <div className="space-y-2">
            {[
              { label: 'View My Children', icon: GraduationCap, to: '/erp/parent/children', color: 'bg-blue-50 text-blue-700' },
              { label: 'Attendance Records', icon: UserCheck, to: '/erp/parent/attendance', color: 'bg-green-50 text-green-700' },
              { label: 'Academic Results', icon: Award, to: '/erp/parent/results', color: 'bg-amber-50 text-amber-700' },
              { label: 'Homework Tracker', icon: Clipboard, to: '/erp/parent/homework', color: 'bg-purple-50 text-purple-700' },
              { label: 'Fee Status', icon: CreditCard, to: '/erp/parent/fees', color: 'bg-rose-50 text-rose-700' },
              { label: 'Notices', icon: Bell, to: '/erp/parent/notices', color: 'bg-secondary-50 text-secondary-700' },
            ].map((action) => (
              <Link key={action.label} to={action.to} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors hover:opacity-80 ${action.color}`}>
                <action.icon size={17} /> {action.label}
              </Link>
            ))}
          </div>
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
                <div key={n.id} className="p-3 rounded-xl bg-secondary-50 border border-secondary-100">
                  <div className="text-sm font-semibold text-secondary-900 line-clamp-2">{n.title}</div>
                  <span className="text-xs text-secondary-500 mt-1">{n.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact School */}
      <div className="mt-6 bg-primary-50 border border-primary-100 rounded-2xl p-6">
        <h2 className="font-heading font-bold text-lg text-secondary-900 mb-3">Contact the School</h2>
        <p className="text-secondary-600 text-sm mb-4">For any concerns about your child's education, please reach out to us.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="tel:051531919" className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
            Call: 051531919
          </a>
          <a href="mailto:goldenfutureschool29@gmail.com" className="flex items-center gap-2 border border-primary-200 hover:border-primary-400 text-primary-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
            goldenfutureschool29@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
