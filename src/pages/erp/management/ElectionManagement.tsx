import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../../firebase/config';
import { Plus, Vote, Loader2, Trash2, Edit3, X, Trophy, Users, Crown, Shield, Star, Save, Upload, Image as ImageIcon } from 'lucide-react';
import type { ElectionPosition, ClassLevel, House } from '../../../types';

const positions: ElectionPosition[] = [
  'Head Boy', 'Head Girl',
  'Games Captain (Boys)', 'Games Captain (Girls)',
  'Red House Captain', 'Blue House Captain', 'Green House Captain', 'Yellow House Captain',
  'Red House Vice Captain', 'Blue House Vice Captain', 'Green House Vice Captain', 'Yellow House Vice Captain',
];

const classOptions: ClassLevel[] = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
  'Class 7', 'Class 8', 'Class 9', 'Class 10',
];

const houseOptions: House[] = ['Red', 'Blue', 'Green', 'Yellow'];

const positionIcons: Record<string, typeof Crown> = {
  'Head Boy': Crown,
  'Head Girl': Crown,
  'Games Captain (Boys)': Trophy,
  'Games Captain (Girls)': Trophy,
};

const houseColors: Record<string, string> = {
  Red: 'bg-red-100 text-red-700 border-red-200',
  Blue: 'bg-blue-100 text-blue-700 border-blue-200',
  Green: 'bg-green-100 text-green-700 border-green-200',
  Yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";
const labelClass = "block text-sm font-medium text-secondary-700 mb-1.5";

interface CandidateForm {
  name: string;
  position: string;
  classLevel: string;
  section: string;
  house: string;
  studentId: string;
  photoURL: string;
  manifesto: string;
  votes: string;
  isElected: boolean;
}

const emptyForm: CandidateForm = {
  name: '', position: '', classLevel: '', section: '', house: '',
  studentId: '', photoURL: '', manifesto: '', votes: '0', isElected: false,
};

export default function ElectionManagement() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CandidateForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['election-candidates-admin'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'electionCandidates'), orderBy('position')));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
  });

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (c: any) => {
    setForm({
      name: c.name || '',
      position: c.position || '',
      classLevel: c.class || '',
      section: c.section || '',
      house: c.house || '',
      studentId: c.studentId || '',
      photoURL: c.photoURL || '',
      manifesto: c.manifesto || '',
      votes: String(c.votes || 0),
      isElected: c.isElected || false,
    });
    setEditId(c.id);
    setError(null);
    setModalOpen(true);
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `election/${Date.now()}_${file.name}`;
      const fileRef = ref(storage, fileName);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setForm(prev => ({ ...prev, photoURL: url }));
    } catch (err: any) {
      setError('Failed to upload photo. You can still paste a URL instead.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.position || !form.classLevel || !form.house) {
      setError('Name, position, class, and house are required.');
      return;
    }

    setSaving(true);
    try {
      const data: Record<string, any> = {
        name: form.name.trim(),
        position: form.position,
        class: form.classLevel,
        section: form.section || null,
        house: form.house,
        studentId: form.studentId.trim() || null,
        photoURL: form.photoURL.trim() || null,
        manifesto: form.manifesto.trim() || null,
        votes: parseInt(form.votes, 10) || 0,
        isElected: form.isElected,
      };

      if (editId) {
        await updateDoc(doc(db, 'electionCandidates', editId), data);
      } else {
        await addDoc(collection(db, 'electionCandidates'), data);
      }

      queryClient.invalidateQueries({ queryKey: ['election-candidates-admin'] });
      queryClient.invalidateQueries({ queryKey: ['election-candidates'] });
      setModalOpen(false);
      setForm(emptyForm);
      setEditId(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save candidate.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'electionCandidates', confirmDelete.id));
      queryClient.invalidateQueries({ queryKey: ['election-candidates-admin'] });
      queryClient.invalidateQueries({ queryKey: ['election-candidates'] });
      setConfirmDelete(null);
    } catch (err) {
      console.error('Failed to delete candidate', err);
    } finally {
      setDeleting(false);
    }
  };

  const grouped = positions.map(pos => ({
    position: pos,
    candidates: candidates.filter((c: any) => c.position === pos),
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-secondary-900 mb-1">Election Management</h1>
          <p className="text-secondary-500 text-sm">Add, edit, and manage student council election candidates and results.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
        >
          <Plus size={16} /> Add Candidate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Total Candidates</div>
          <div className="font-heading font-bold text-2xl text-secondary-900">{candidates.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Positions Filled</div>
          <div className="font-heading font-bold text-2xl text-secondary-900">
            {grouped.filter(g => g.candidates.length > 0).length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Elected</div>
          <div className="font-heading font-bold text-2xl text-green-600">
            {candidates.filter((c: any) => c.isElected).length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <div className="text-secondary-500 text-xs font-medium mb-1">Total Votes</div>
          <div className="font-heading font-bold text-2xl text-secondary-900">
            {candidates.reduce((sum: number, c: any) => sum + (c.votes || 0), 0)}
          </div>
        </div>
      </div>

      {/* Candidate groups */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-primary-600" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-secondary-100 p-12 text-center">
          <Vote size={40} className="mx-auto mb-3 text-secondary-200" />
          <p className="text-secondary-500 text-sm mb-1">No election candidates yet.</p>
          <button onClick={openCreate} className="mt-3 text-primary-600 hover:text-primary-800 text-sm font-medium">
            Add the first candidate →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ position, candidates: posCandidates }) => {
            if (posCandidates.length === 0) return null;
            const Icon = positionIcons[position] || Shield;
            return (
              <div key={position} className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
                <div className="px-5 py-4 bg-secondary-50 border-b border-secondary-100 flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon size={17} className="text-primary-700" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-secondary-900">{position}</h3>
                  <span className="text-xs text-secondary-400 ml-auto">{posCandidates.length} candidate{posCandidates.length > 1 ? 's' : ''}</span>
                </div>
                <div className="divide-y divide-secondary-50">
                  {posCandidates.map((c: any) => (
                    <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-secondary-50/50 transition-colors">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary-100 shrink-0">
                        {c.photoURL ? (
                          <img src={c.photoURL} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-100">
                            <Users size={18} className="text-primary-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-secondary-900 truncate">{c.name}</span>
                          {c.isElected && (
                            <span className="flex items-center gap-0.5 text-xs font-bold text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full">
                              <Trophy size={10} /> Elected
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-secondary-500">{c.class}{c.section ? ` – ${c.section}` : ''}</span>
                          {c.house && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${houseColors[c.house] || ''}`}>
                              {c.house}
                            </span>
                          )}
                          <span className="text-xs text-secondary-400">{c.votes || 0} votes</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(c)}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-secondary-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Vote size={20} className="text-primary-700" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-secondary-900">
                    {editId ? 'Edit Candidate' : 'Add Candidate'}
                  </h3>
                  <p className="text-secondary-500 text-xs">Enter the candidate's details below</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-secondary-400 hover:text-secondary-600 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">{error}</div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Full Name <span className="text-rose-600">*</span></label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Candidate name" />
                </div>
                <div>
                  <label className={labelClass}>Position <span className="text-rose-600">*</span></label>
                  <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className={inputClass}>
                    <option value="">Select position</option>
                    {positions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>House <span className="text-rose-600">*</span></label>
                  <select value={form.house} onChange={(e) => setForm({ ...form, house: e.target.value })} className={inputClass}>
                    <option value="">Select house</option>
                    {houseOptions.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Class <span className="text-rose-600">*</span></label>
                  <select value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: e.target.value })} className={inputClass}>
                    <option value="">Select class</option>
                    {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Section</label>
                  <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className={inputClass}>
                    <option value="">None</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Student ID</label>
                  <input type="text" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className={inputClass} placeholder="Student UID (optional)" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Candidate Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary-100 border border-secondary-200 shrink-0">
                      {form.photoURL ? (
                        <img src={form.photoURL} alt="Candidate" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={24} className="text-secondary-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors w-fit">
                        {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(file);
                          }}
                        />
                      </label>
                      <input type="text" value={form.photoURL} onChange={(e) => setForm({ ...form, photoURL: e.target.value })} className={inputClass} placeholder="Or paste photo URL" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Votes</label>
                  <input type="number" value={form.votes} onChange={(e) => setForm({ ...form, votes: e.target.value })} className={inputClass} placeholder="0" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Manifesto</label>
                  <textarea value={form.manifesto} onChange={(e) => setForm({ ...form, manifesto: e.target.value })} rows={3} className={inputClass} placeholder="Candidate's manifesto (optional)" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isElected}
                      onChange={(e) => setForm({ ...form, isElected: e.target.checked })}
                      className="w-5 h-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-secondary-700 flex items-center gap-1.5">
                      <Trophy size={14} className="text-gold-600" /> Mark as elected
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-secondary-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : editId ? 'Update Candidate' : 'Add Candidate'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-secondary-200 hover:bg-secondary-50 text-secondary-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
                <h3 className="font-heading font-bold text-lg text-secondary-900">Delete Candidate?</h3>
                <p className="text-secondary-500 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-secondary-600 text-sm mb-6">
              You are about to delete <span className="font-semibold text-secondary-900">{confirmDelete.name}</span> from the {confirmDelete.position} position.
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
