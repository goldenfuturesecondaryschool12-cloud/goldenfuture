import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { UserPlus, Search, GraduationCap, Loader2, Trash2, X } from 'lucide-react';
import UserCreateModal from '../../../components/erp/UserCreateModal';

const classOptions = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
  'Class 7', 'Class 8', 'Class 9', 'Class 10',
];

const houseColors: Record<string, string> = {
  Red: 'bg-red-100 text-red-700',
  Blue: 'bg-blue-100 text-blue-700',
  Green: 'bg-green-100 text-green-700',
  Yellow: 'bg-yellow-100 text-yellow-700',
};

export default function StudentManagement() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students-list'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
  });

  const filtered = students.filter((s: any) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      s.displayName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.admissionNumber?.toLowerCase().includes(q) ||
      s.parentName?.toLowerCase().includes(q);
    const matchesClass = classFilter === 'All' || s.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', confirmDelete.id));
      queryClient.invalidateQueries({ queryKey: ['students-list'] });
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
          <p className="text-secondary-500 text-sm">Create and manage student accounts.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
        >
          <UserPlus size={16} /> Create Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Total Students</div>
          <div className="font-heading font-bold text-2xl text-secondary-900">{students.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Classes</div>
          <div className="font-heading font-bold text-2xl text-secondary-900">
            {new Set(students.map((s: any) => s.class).filter(Boolean)).size}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Red House</div>
          <div className="font-heading font-bold text-2xl text-red-600">{students.filter((s: any) => s.house === 'Red').length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Blue House</div>
          <div className="font-heading font-bold text-2xl text-blue-600">{students.filter((s: any) => s.house === 'Blue').length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, admission no, or parent name..."
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
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-secondary-100 p-12 text-center">
          <GraduationCap size={40} className="mx-auto mb-3 text-secondary-200" />
          <p className="text-secondary-500 text-sm mb-1">{search || classFilter !== 'All' ? 'No students match your filters.' : 'No students yet.'}</p>
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
                  <th className="px-5 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider hidden xl:table-cell">Contact</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-50">
                {filtered.map((s: any) => (
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
                      <span className="text-sm text-secondary-600">
                        {s.class || '—'}{s.section ? ` – ${s.section}` : ''}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {s.house ? (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${houseColors[s.house] || 'bg-secondary-100 text-secondary-600'}`}>
                          {s.house}
                        </span>
                      ) : <span className="text-xs text-secondary-400">—</span>}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="text-sm text-secondary-600 truncate">{s.parentName || '—'}</div>
                      {s.parentPhone && <div className="text-xs text-secondary-400">{s.parentPhone}</div>}
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <div className="text-sm text-secondary-600 truncate">{s.email}</div>
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

      <UserCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        role="student"
        onCreated={() => queryClient.invalidateQueries({ queryKey: ['students-list'] })}
      />

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
