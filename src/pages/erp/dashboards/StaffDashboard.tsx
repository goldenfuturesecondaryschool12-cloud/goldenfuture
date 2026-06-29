import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Bell, Download, User } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function StaffDashboard() {
  const { userProfile } = useAuth();

  const { data: notices = [] } = useQuery({
    queryKey: ['notices-staff'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'notices'), where('isActive', '==', true), orderBy('publishedAt', 'desc'), limit(5)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-secondary-900 mb-1">
          Welcome, {userProfile?.displayName || 'Staff'}
        </h1>
        <p className="text-secondary-500 text-sm">Access your profile, notices, and school resources.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">My Profile</h2>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-secondary-100 rounded-2xl flex items-center justify-center mb-4">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <User size={36} className="text-secondary-300" />
              )}
            </div>
            <div className="font-heading font-bold text-secondary-900 text-lg">{userProfile?.displayName}</div>
            <div className="text-secondary-500 text-sm">Staff Member</div>
            <Link to="/erp/staff/profile" className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
              <User size={15} /> View Full Profile
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Quick Access</h2>
          <div className="space-y-2">
            {[
              { label: 'View Notices', icon: Bell, to: '/erp/staff/notices', color: 'bg-amber-50 text-amber-700' },
              { label: 'Downloads', icon: Download, to: '/erp/staff/downloads', color: 'bg-blue-50 text-blue-700' },
              { label: 'Public Website', icon: User, to: '/', color: 'bg-secondary-50 text-secondary-700' },
            ].map((action) => (
              <Link key={action.label} to={action.to} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors hover:opacity-80 ${action.color}`}>
                <action.icon size={17} /> {action.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary-50 rounded-xl">
            <p className="text-primary-700 text-sm font-medium mb-1">Contact School Office</p>
            <a href="tel:051531919" className="text-primary-600 text-sm">051531919</a>
          </div>
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
                <div key={n.id} className="p-3 rounded-xl bg-secondary-50 border border-secondary-100">
                  <div className="text-sm font-semibold text-secondary-900 line-clamp-2">{n.title}</div>
                  <span className="text-xs text-secondary-500 mt-1">{n.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
