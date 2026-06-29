import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Users, GraduationCap, Award, UserCheck, BarChart2, Vote, Bell, Plus, ClipboardList } from 'lucide-react';
import StatCard from '../../../components/erp/StatCard';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function PrincipalDashboard() {
  const { userProfile } = useAuth();

  const { data: teacherCount = 0 } = useQuery({
    queryKey: ['teacher-count'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'teacher')));
      return snap.size;
    },
  });

  const { data: studentCount = 0 } = useQuery({
    queryKey: ['student-count-principal'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
      return snap.size;
    },
  });

  const { data: pendingApplications = 0 } = useQuery({
    queryKey: ['pending-admissions-principal'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'admission_applications'), where('status', '==', 'pending')));
      return snap.size;
    },
  });

  const stats = [
    { title: 'Total Teachers', value: teacherCount, icon: Users, color: 'text-green-700', bgColor: 'bg-green-100' },
    { title: 'Total Students', value: studentCount, icon: GraduationCap, color: 'text-blue-700', bgColor: 'bg-blue-100' },
    { title: "Today's Attendance", value: '—', icon: UserCheck, color: 'text-amber-700', bgColor: 'bg-amber-100' },
    { title: 'Pending Admissions', value: pendingApplications, icon: ClipboardList, color: 'text-rose-700', bgColor: 'bg-rose-100' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-secondary-900 mb-1">
          Welcome, {userProfile?.displayName || 'Principal'}
        </h1>
        <p className="text-secondary-500 text-sm">School overview, teacher management, and academic supervision.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <h2 className="font-heading font-bold text-lg text-secondary-900 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Manage Teachers', icon: Users, color: 'bg-green-50 text-green-700', to: '/erp/principal/teachers' },
              { label: 'View Students', icon: GraduationCap, color: 'bg-blue-50 text-blue-700', to: '/erp/principal/students' },
              { label: 'Attendance', icon: UserCheck, color: 'bg-amber-50 text-amber-700', to: '/erp/principal/attendance' },
              { label: 'Results', icon: Award, color: 'bg-rose-50 text-rose-700', to: '/erp/principal/results' },
              { label: 'Post Notice', icon: Bell, color: 'bg-purple-50 text-purple-700', to: '/erp/principal/notices' },
              { label: 'Election', icon: Vote, color: 'bg-cyan-50 text-cyan-700', to: '/erp/principal/election' },
              { label: 'Reports', icon: BarChart2, color: 'bg-secondary-50 text-secondary-700', to: '/erp/principal/reports' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-sm font-medium transition-colors hover:opacity-80 ${action.color}`}
              >
                <action.icon size={22} />
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Principal Portal Card */}
        <div className="bg-primary-900 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/staff/principal_Mr.Umesh_Sah.jpg"
              alt="Principal"
              className="w-14 h-14 rounded-full object-cover border-2 border-gold-400"
            />
            <div>
              <div className="font-heading font-bold text-lg">Principal Portal</div>
              <div className="text-primary-300 text-sm">Mr. Umesh Sah</div>
            </div>
          </div>
          <div className="space-y-3 text-primary-200 text-sm">
            <p>As Principal, you can create and manage teacher accounts. Teachers can then create student accounts and have limited website access.</p>
            <p>Use the Election Management tool to add candidates and publish election results.</p>
          </div>
          <Link to="/erp/principal/teachers" className="mt-6 flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all inline-flex">
            <Plus size={15} /> Create Teacher Account
          </Link>
        </div>
      </div>
    </div>
  );
}
