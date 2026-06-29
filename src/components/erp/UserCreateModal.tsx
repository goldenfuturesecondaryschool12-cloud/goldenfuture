import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, UserPlus, AlertCircle, CheckCircle, Copy, Mail, KeyRound, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole, ClassLevel, Section, House } from '../../types';

interface UserCreateModalProps {
  open: boolean;
  onClose: () => void;
  role: 'teacher' | 'student';
  onCreated?: () => void;
}

const classOptions: ClassLevel[] = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
  'Class 7', 'Class 8', 'Class 9', 'Class 10',
];
const sectionOptions: Section[] = ['A', 'B'];
const houseOptions: House[] = ['Red', 'Blue', 'Green', 'Yellow'];
const genderOptions = ['Male', 'Female', 'Other'];

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-900 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";
const labelClass = "block text-sm font-medium text-secondary-700 mb-1.5";

export default function UserCreateModal({ open, onClose, role, onCreated }: UserCreateModalProps) {
  const { createUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string; name: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Shared fields
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  // Teacher-specific
  const [employeeId, setEmployeeId] = useState('');
  const [qualification, setQualification] = useState('');
  const [subjects, setSubjects] = useState('');
  const [designation, setDesignation] = useState('');
  const [joiningDate, setJoiningDate] = useState('');

  // Student-specific
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [section, setSection] = useState('');
  const [house, setHouse] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentOccupation, setParentOccupation] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');

  const reset = () => {
    setDisplayName(''); setEmail(''); setPassword(''); setPhone(''); setGender(''); setAddress('');
    setEmployeeId(''); setQualification(''); setSubjects(''); setDesignation(''); setJoiningDate('');
    setAdmissionNumber(''); setRollNumber(''); setStudentClass(''); setSection(''); setHouse('');
    setDateOfBirth(''); setParentName(''); setParentPhone(''); setParentEmail(''); setParentOccupation('');
    setBloodGroup(''); setAdmissionDate('');
    setError(null);
    setCreatedCreds(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (role === 'student' && (!studentClass || !house)) {
      setError('Class and house are required for students.');
      return;
    }

    setSubmitting(true);
    try {
      const profile: Record<string, any> = {
        displayName: displayName.trim(),
        role: role as UserRole,
        phone: phone.trim() || undefined,
        gender: gender || undefined,
        address: address.trim() || undefined,
        isActive: true,
      };

      if (role === 'teacher') {
        profile.employeeId = employeeId.trim() || undefined;
        profile.qualification = qualification.trim() || undefined;
        profile.subjects = subjects.split(',').map(s => s.trim()).filter(Boolean);
        profile.designation = designation.trim() || undefined;
        profile.joiningDate = joiningDate || undefined;
      } else {
        profile.admissionNumber = admissionNumber.trim() || undefined;
        profile.rollNumber = rollNumber ? parseInt(rollNumber, 10) : undefined;
        profile.class = studentClass;
        profile.section = section || undefined;
        profile.house = house;
        profile.dateOfBirth = dateOfBirth || undefined;
        profile.parentName = parentName.trim() || undefined;
        profile.parentPhone = parentPhone.trim() || undefined;
        profile.parentEmail = parentEmail.trim() || undefined;
        profile.parentOccupation = parentOccupation.trim() || undefined;
        profile.bloodGroup = bloodGroup.trim() || undefined;
        profile.admissionDate = admissionDate || new Date().toISOString().split('T')[0];
      }

      await createUser(email.trim(), password, profile);
      setCreatedCreds({ email: email.trim(), password, name: displayName.trim() });
      onCreated?.();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setError('This email is already registered. Use a different email.');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError(err?.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Credentials Success Screen */}
        {createdCreds ? (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} className="text-green-600" />
              </div>
              <h3 className="font-heading font-bold text-xl text-secondary-900 mb-1">
                {role === 'teacher' ? 'Teacher' : 'Student'} Account Created!
              </h3>
              <p className="text-secondary-500 text-sm">
                Share these login credentials with <span className="font-semibold text-secondary-700">{createdCreds.name}</span>
              </p>
            </div>

            <div className="bg-secondary-50 rounded-2xl p-5 space-y-4 mb-6">
              <div>
                <label className="text-xs font-medium text-secondary-500 mb-1 block">Login Email (Username)</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-white border border-secondary-200 rounded-xl px-4 py-3">
                    <Mail size={16} className="text-secondary-400 shrink-0" />
                    <span className="text-sm font-medium text-secondary-900 break-all">{createdCreds.email}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(createdCreds.email, 'email')}
                    className="p-3 rounded-xl border border-secondary-200 hover:bg-secondary-100 text-secondary-600 transition-colors shrink-0"
                    title="Copy email"
                  >
                    {copied === 'email' ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-secondary-500 mb-1 block">Password</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-white border border-secondary-200 rounded-xl px-4 py-3">
                    <KeyRound size={16} className="text-secondary-400 shrink-0" />
                    <span className="text-sm font-medium text-secondary-900">{createdCreds.password}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(createdCreds.password, 'password')}
                    className="p-3 rounded-xl border border-secondary-200 hover:bg-secondary-100 text-secondary-600 transition-colors shrink-0"
                    title="Copy password"
                  >
                    {copied === 'password' ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2">
                <LogIn size={16} className="text-primary-600 mt-0.5 shrink-0" />
                <p className="text-primary-700 text-sm">
                  The {role === 'teacher' ? 'teacher' : 'student'} can now log in at the ERP Portal login page using these credentials.
                  {role === 'teacher' && ' Teachers can create student accounts and have limited website access.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setCreatedCreds(null); reset(); }}
                className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <UserPlus size={16} /> Create Another
              </button>
              <button
                onClick={handleClose}
                className="border border-secondary-200 hover:bg-secondary-50 text-secondary-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
        <>
        {/* Header */}
        <div className="p-6 border-b border-secondary-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <UserPlus size={20} className="text-primary-700" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-secondary-900">
                Create {role === 'teacher' ? 'Teacher' : 'Student'} Account
              </h3>
              <p className="text-secondary-500 text-xs">Fill in the details below to create a new account</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-secondary-400 hover:text-secondary-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="text-rose-600 mt-0.5 shrink-0" />
              <p className="text-rose-700 text-sm">{error}</p>
            </div>
          )}

          {/* Account Info */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-secondary-800 mb-4 pb-2 border-b border-secondary-100">Account Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Full Name <span className="text-rose-600">*</span></label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} placeholder="Enter full name" />
              </div>
              <div>
                <label className={labelClass}>Email <span className="text-rose-600">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>Password <span className="text-rose-600">*</span></label>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Min 6 characters" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="98XXXXXXXX" />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
                  <option value="">Select</option>
                  {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} placeholder="Residential address" />
              </div>
            </div>
          </div>

          {/* Role-specific fields */}
          {role === 'teacher' ? (
            <div>
              <h4 className="font-heading font-semibold text-sm text-secondary-800 mb-4 pb-2 border-b border-secondary-100">Professional Details</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Employee ID</label>
                  <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={inputClass} placeholder="e.g. GFSS-T-001" />
                </div>
                <div>
                  <label className={labelClass}>Designation</label>
                  <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className={inputClass} placeholder="e.g. Senior Teacher" />
                </div>
                <div>
                  <label className={labelClass}>Qualification</label>
                  <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} className={inputClass} placeholder="e.g. M.Ed, B.Ed" />
                </div>
                <div>
                  <label className={labelClass}>Subjects (comma-separated)</label>
                  <input type="text" value={subjects} onChange={(e) => setSubjects(e.target.value)} className={inputClass} placeholder="e.g. Mathematics, Science" />
                </div>
                <div>
                  <label className={labelClass}>Joining Date</label>
                  <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-heading font-semibold text-sm text-secondary-800 mb-4 pb-2 border-b border-secondary-100">Student Details</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Admission Number</label>
                  <input type="text" value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} className={inputClass} placeholder="e.g. GFSS-2024-001" />
                </div>
                <div>
                  <label className={labelClass}>Roll Number</label>
                  <input type="number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} className={inputClass} placeholder="e.g. 15" />
                </div>
                <div>
                  <label className={labelClass}>Class <span className="text-rose-600">*</span></label>
                  <select value={studentClass} onChange={(e) => setStudentClass(e.target.value)} className={inputClass}>
                    <option value="">Select class</option>
                    {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Section</label>
                  <select value={section} onChange={(e) => setSection(e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {sectionOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>House <span className="text-rose-600">*</span></label>
                  <select value={house} onChange={(e) => setHouse(e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {houseOptions.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Blood Group</label>
                  <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={inputClass} placeholder="e.g. O+" />
                </div>
                <div>
                  <label className={labelClass}>Admission Date</label>
                  <input type="date" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} className={inputClass} />
                </div>
              </div>
              <h4 className="font-heading font-semibold text-sm text-secondary-800 mb-4 mt-6 pb-2 border-b border-secondary-100">Parent / Guardian Details</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Parent Name</label>
                  <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} className={inputClass} placeholder="Parent / guardian name" />
                </div>
                <div>
                  <label className={labelClass}>Parent Phone</label>
                  <input type="tel" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} className={inputClass} placeholder="98XXXXXXXX" />
                </div>
                <div>
                  <label className={labelClass}>Parent Email</label>
                  <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} className={inputClass} placeholder="parent@example.com" />
                </div>
                <div>
                  <label className={labelClass}>Parent Occupation</label>
                  <input type="text" value={parentOccupation} onChange={(e) => setParentOccupation(e.target.value)} className={inputClass} placeholder="e.g. Business" />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-2 border-t border-secondary-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {submitting ? 'Creating...' : `Create ${role === 'teacher' ? 'Teacher' : 'Student'}`}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="border border-secondary-200 hover:bg-secondary-50 text-secondary-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
        </>
        )}
      </motion.div>
    </div>
  );
}
