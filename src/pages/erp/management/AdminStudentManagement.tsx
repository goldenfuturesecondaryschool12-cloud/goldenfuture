import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { UserPlus, Search, GraduationCap, Loader2, Trash2, ClipboardList, CheckCircle, XCircle, Eye, Clock, FileText } from 'lucide-react';
import UserCreateModal from '../../../components/erp/UserCreateModal';
import { useAuth } from '../../../contexts/AuthContext';
import { motion } from 'framer-motion';

const classOptions = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
  'Class 7', 'Class 8', 'Class 9', 'Class 10',
];

const houseOptions = ['Red', 'Blue', 'Green', 'Yellow'];

const houseColors: Record<string, string> = {
  Red: 'bg-red-100 text-red-700',
  Blue: 'bg-blue-100 text-blue-700',
  Green: 'bg-green-100 text-green-700',
  Yellow: 'bg-yellow-100 text-yellow-700',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  reviewed: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-rose-100 text-rose-700',
};

type Tab = 'students' | 'applications';

export default function AdminStudentManagement() {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('students');
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['admin-students-list'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['admin-admission-applications-full'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'admission_applications'), orderBy('createdAt', 'desc'), limit(50)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
  });

  const filteredStudents = students.filter((s: any) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      s.displayName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.admissionNumber?.toLowerCase().includes(q);
    const matchesClass = classFilter === 'All' || s.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const pendingCount = applications.filter((a: any) => a.status === 'pending').length;

  const updateAppStatus = async (appId: string, status: string) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'admission_applications', appId), { status });
      queryClient.invalidateQueries({ queryKey: ['admin-admission-applications-full'] });
      queryClient.invalidateQueries({ queryKey: ['admin-admission-applications'] });
      setSelectedApp(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      console.error('Failed to update application status', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', confirmDelete.id));
      queryClient.invalidateQueries({ queryKey: ['admin-students-list'] });
      setConfirmDelete(null);
    } catch (err) {
      console.error('Failed to delete student', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-secondary-900 mb-1">Student Management</h1>
          <p className="text-secondary-500 text-sm">Manage student accounts and review online admission applications.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
        >
          <UserPlus size={16} /> Create Student
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-secondary-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'students' ? 'bg-white text-primary-700 shadow-sm' : 'text-secondary-500 hover:text-secondary-700'
          }`}
        >
          <GraduationCap size={16} /> Students ({students.length})
        </button>
        <button
          onClick={() => setTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'applications' ? 'bg-white text-primary-700 shadow-sm' : 'text-secondary-500 hover:text-secondary-700'
          }`}
        >
          <ClipboardList size={16} /> Applications ({pendingCount} pending)
        </button>
      </div>

      {/* Students Tab */}
      {tab === 'students' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or admission no..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-secondary-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-secondary-200 bg-white text-sm font-medium text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="All">All Classes</option>
              {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Table */}
          {studentsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-primary-600" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-secondary-100 p-12 text-center">
              <GraduationCap size={40} className="mx-auto mb-3 text-secondary-200" />
              <p className="text-secondary-500 text-sm">{search || classFilter !== 'All' ? 'No students match your filters.' : 'No students yet.'}</p>
              {!search && classFilter === 'All' && (
                <button onClick={() => setModalOpen(true)} className="mt-3 text-primary-600 hover:text-primary-800 text-sm font-medium">
                  Create the first student account →
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50 border-b border-secondary-100">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">Student</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider hidden md:table-cell">Class</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider hidden lg:table-cell">House</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider hidden md:table-cell">Parent</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-secondary-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-50">
                    {filteredStudents.map((s: any) => (
                      <tr key={s.id} className="hover:bg-secondary-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center shrink-0">
                              <span className="font-heading font-bold text-sm text-cyan-700">
                                {(s.displayName || '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-secondary-900 truncate">{s.displayName || 'Unnamed'}</div>
                              {s.admissionNumber && <div className="text-xs text-secondary-400">{s.admissionNumber}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="text-sm text-secondary-600">{s.class || '—'}{s.section ? ` – ${s.section}` : ''}</span>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          {s.house ? (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${houseColors[s.house] || ''}`}>{s.house}</span>
                          ) : <span className="text-xs text-secondary-400">—</span>}
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="text-sm text-secondary-600 truncate">{s.parentName || '—'}</div>
                          {s.parentPhone && <div className="text-xs text-secondary-400">{s.parentPhone}</div>}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setConfirmDelete(s)}
                            className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Applications Tab */}
      {tab === 'applications' && (
        <>
          {appsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-primary-600" />
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-secondary-100 p-12 text-center">
              <ClipboardList size={40} className="mx-auto mb-3 text-secondary-200" />
              <p className="text-secondary-500 text-sm">No admission applications yet.</p>
              <p className="text-secondary-400 text-xs mt-1">Online applications from the public Admissions page will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app: any) => (
                <div key={app.id} className="bg-white rounded-2xl border border-secondary-100 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                      <GraduationCap size={20} className="text-primary-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-secondary-900 truncate">
                        {app.studentFirstName} {app.studentMiddleName || ''} {app.studentLastName || ''}
                      </div>
                      <div className="text-xs text-secondary-500 flex items-center gap-2 flex-wrap">
                        <span>{app.applyingForClass}</span>
                        <span>·</span>
                        <span>{app.studentGender}</span>
                        {app.createdAt?.toDate && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-0.5">
                              <Clock size={11} /> {new Date(app.createdAt.toDate()).toLocaleDateString()}
                            </span>
                          </>
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
                      className="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <UserCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        role="student"
        onCreated={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-students-list'] });
          queryClient.invalidateQueries({ queryKey: ['student-count'] });
        }}
      />

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedApp(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-secondary-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
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
                onClick={() => updateAppStatus(selectedApp.id, 'accepted')}
                disabled={updating}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <CheckCircle size={16} /> Accept
              </button>
              <button
                onClick={() => updateAppStatus(selectedApp.id, 'rejected')}
                disabled={updating}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <XCircle size={16} /> Reject
              </button>
              <button
                onClick={() => updateAppStatus(selectedApp.id, 'reviewed')}
                disabled={updating}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <FileText size={16} /> Mark Reviewed
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

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <Trash2 size={22} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-secondary-900">Delete Student?</h3>
                <p className="text-secondary-500 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-secondary-600 text-sm mb-6">
              You are about to delete <span className="font-semibold text-secondary-900">{confirmDelete.displayName}</span> ({confirmDelete.email}).
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="border border-secondary-200 hover:bg-secondary-50 text-secondary-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
