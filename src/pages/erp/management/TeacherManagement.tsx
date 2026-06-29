import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { UserPlus, Search, Users, Loader2, Trash2, ToggleRight, ToggleLeft, Mail, Phone, X } from 'lucide-react';
import UserCreateModal from '../../../components/erp/UserCreateModal';
import { useAuth } from '../../../contexts/AuthContext';

export default function TeacherManagement() {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['teachers-list'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'teacher')));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
  });

  const filtered = teachers.filter((t: any) => {
    const q = search.toLowerCase();
    return !q ||
      t.displayName?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.employeeId?.toLowerCase().includes(q) ||
      t.designation?.toLowerCase().includes(q);
  });

  const toggleActive = async (teacher: any) => {
    try {
      await updateDoc(doc(db, 'users', teacher.id), { isActive: !teacher.isActive });
      queryClient.invalidateQueries({ queryKey: ['teachers-list'] });
    } catch (err) {
      console.error('Failed to update teacher', err);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', confirmDelete.id));
      queryClient.invalidateQueries({ queryKey: ['teachers-list'] });
      setConfirmDelete(null);
    } catch (err) {
      console.error('Failed to delete teacher', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-secondary-900 mb-1">Teacher Management</h1>
          <p className="text-secondary-500 text-sm">Create and manage teacher accounts. Teachers can create student accounts and have limited website access.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
        >
          <UserPlus size={16} /> Create Teacher
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Total Teachers</div>
          <div className="font-heading font-bold text-2xl text-secondary-900">{teachers.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Active</div>
          <div className="font-heading font-bold text-2xl text-green-600">{teachers.filter((t: any) => t.isActive !== false).length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Inactive</div>
          <div className="font-heading font-bold text-2xl text-secondary-400">{teachers.filter((t: any) => t.isActive === false).length}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, employee ID, or designation..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-secondary-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-secondary-100 p-12 text-center">
          <Users size={40} className="mx-auto mb-3 text-secondary-200" />
          <p className="text-secondary-500 text-sm mb-1">{search ? 'No teachers match your search.' : 'No teachers yet.'}</p>
          {!search && (
            <button onClick={() => setModalOpen(true)} className="mt-3 text-primary-600 hover:text-primary-800 text-sm font-medium">
              Create the first teacher account →
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider hidden lg:table-cell">Designation</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider hidden lg:table-cell">Subjects</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-secondary-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-50">
                {filtered.map((t: any) => (
                  <tr key={t.id} className="hover:bg-secondary-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                          <span className="font-heading font-bold text-sm text-green-700">
                            {(t.displayName || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-secondary-900 truncate">{t.displayName || 'Unnamed'}</div>
                          {t.employeeId && <div className="text-xs text-secondary-400">{t.employeeId}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="text-sm text-secondary-600 truncate">{t.email}</div>
                      {t.phone && <div className="text-xs text-secondary-400">{t.phone}</div>}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-secondary-600">{t.designation || '—'}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(t.subjects || []).slice(0, 3).map((s: string, i: number) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                        {(t.subjects || []).length === 0 && <span className="text-xs text-secondary-400">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => toggleActive(t)}
                        className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                        title={t.isActive === false ? 'Activate' : 'Deactivate'}
                      >
                        {t.isActive === false ? (
                          <><ToggleLeft size={20} className="text-secondary-400" /> <span className="text-secondary-400">Inactive</span></>
                        ) : (
                          <><ToggleRight size={20} className="text-green-600" /> <span className="text-green-600">Active</span></>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setConfirmDelete(t)}
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
        role="teacher"
        onCreated={() => queryClient.invalidateQueries({ queryKey: ['teachers-list'] })}
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
                <h3 className="font-heading font-bold text-lg text-secondary-900">Delete Teacher?</h3>
                <p className="text-secondary-500 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-secondary-600 text-sm mb-6">
              You are about to delete <span className="font-semibold text-secondary-900">{confirmDelete.displayName}</span> ({confirmDelete.email}). The teacher's profile will be removed from the system.
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
