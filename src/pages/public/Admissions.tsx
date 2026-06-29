import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Calendar, Phone, Mail, ArrowRight, AlertCircle, Send, Loader2, User, Users, GraduationCap, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const steps = [
  {
    step: 1,
    title: 'Submit Online Application',
    desc: 'Fill out the online admission form below with the student and guardian details.',
    icon: FileText,
  },
  {
    step: 2,
    title: 'Visit School Office',
    desc: 'Bring the required documents and the printed application confirmation to the school office.',
    icon: CheckCircle,
  },
  {
    step: 3,
    title: 'Entrance Assessment',
    desc: 'Students applying for Class 1 and above may be required to appear in a short assessment for placement.',
    icon: Calendar,
  },
  {
    step: 4,
    title: 'Admission Confirmation',
    desc: 'Upon successful assessment, pay the admission fees and receive your official admission confirmation and student ID.',
    icon: CheckCircle,
  },
];

const documents = [
  'Birth certificate (for Nursery–Class 1)',
  'Citizenship certificate of parent/guardian',
  'Transfer certificate (for students from other schools)',
  'Character certificate (from previous school)',
  'Mark sheet / report card from previous class',
  '4 recent passport-size photographs',
  'Parent/guardian phone number and email',
  'Medical fitness certificate (if required)',
];

const fees = [
  { class: 'Nursery', admission: 'As per school policy', monthly: 'Contact school' },
  { class: 'LKG / UKG', admission: 'As per school policy', monthly: 'Contact school' },
  { class: 'Class 1 – 6', admission: 'As per school policy', monthly: 'Contact school' },
  { class: 'Class 7 – 8', admission: 'As per school policy', monthly: 'Contact school' },
  { class: 'Class 9 – 10', admission: 'As per school policy', monthly: 'Contact school' },
];

const classOptions = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
  'Class 7', 'Class 8', 'Class 9', 'Class 10',
];

const genderOptions = ['Male', 'Female', 'Other'];

const hearAboutOptions = [
  'Friend or family',
  'Social media',
  'School website',
  'Newspaper',
  'Banner / hoarding',
  'Other',
];

interface FormData {
  studentFirstName: string;
  studentMiddleName: string;
  studentLastName: string;
  studentDob: string;
  studentGender: string;
  applyingForClass: string;
  previousSchool: string;
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  guardianEmail: string;
  address: string;
  bloodGroup: string;
  nationality: string;
  howDidYouHear: string;
  additionalInfo: string;
}

const initialForm: FormData = {
  studentFirstName: '',
  studentMiddleName: '',
  studentLastName: '',
  studentDob: '',
  studentGender: '',
  applyingForClass: '',
  previousSchool: '',
  fatherName: '',
  fatherOccupation: '',
  fatherPhone: '',
  motherName: '',
  motherOccupation: '',
  motherPhone: '',
  guardianEmail: '',
  address: '',
  bloodGroup: '',
  nationality: 'Nepali',
  howDidYouHear: '',
  additionalInfo: '',
};

function SectionTitle({ icon: Icon, title, subtitle }: { icon: typeof User; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-secondary-100">
      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
        <Icon size={20} className="text-primary-700" />
      </div>
      <div>
        <h3 className="font-heading font-bold text-lg text-secondary-900 leading-tight">{title}</h3>
        <p className="text-secondary-500 text-xs">{subtitle}</p>
      </div>
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-900 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";
const labelClass = "block text-sm font-medium text-secondary-700 mb-1.5";

export default function Admissions() {
  useDocumentTitle('Admissions');
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.studentFirstName.trim()) e.studentFirstName = 'Required';
    if (!form.studentDob) e.studentDob = 'Required';
    if (!form.studentGender) e.studentGender = 'Required';
    if (!form.applyingForClass) e.applyingForClass = 'Required';
    if (!form.fatherName.trim()) e.fatherName = 'Required';
    if (!form.fatherPhone.trim()) e.fatherPhone = 'Required';
    if (!form.guardianEmail.trim()) e.guardianEmail = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guardianEmail)) e.guardianEmail = 'Invalid email';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.nationality.trim()) e.nationality = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError(null);
    if (!validate()) {
      const firstError = document.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'admission_applications'), {
        ...form,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setForm(initialForm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError('Could not submit your application. Please try again or contact the school office.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Admissions"
        subtitle="Join the Golden Future family. We welcome students from Nursery to Class 10 who are eager to learn and grow."
        breadcrumbs={[{ label: 'Home' }, { label: 'Admissions' }]}
      />

      {/* Open Admissions Banner */}
      <section className="py-8 bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 text-green-700">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-semibold">
              Admissions are currently open for Academic Year 2082–2083 B.S. Apply online below or contact us to schedule a school visit.
            </p>
          </div>
        </div>
      </section>

      {/* Success message */}
      {submitted && (
        <section className="py-10 bg-green-50 border-b border-green-100">
          <div className="max-w-3xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-green-200 p-8 text-center shadow-sm"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={36} className="text-green-600" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-secondary-900 mb-2">Application Submitted!</h2>
              <p className="text-secondary-600 text-sm mb-6 max-w-md mx-auto">
                Thank you for applying to Golden Future Secondary School. We have received your application. Our admissions office will contact you within 2–3 working days. Please visit the school office with the required documents to complete the admission process.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setSubmitted(false)}
                  className="flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  Submit Another Application
                </button>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 border border-secondary-200 hover:border-primary-300 text-secondary-700 hover:text-primary-700 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  Contact School <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Admission Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">
              Admission Process
            </h2>
            <p className="text-secondary-500 max-w-xl mx-auto">
              A simple, transparent, and welcoming process to join our school family.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary-100 z-0" style={{ width: 'calc(100% - 32px)', left: '50%' }} />
                )}
                <div className="bg-white border border-secondary-100 rounded-2xl p-6 relative z-10 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                    <span className="font-heading font-bold text-2xl text-primary-700">{step.step}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-secondary-900 mb-2">{step.title}</h3>
                  <p className="text-secondary-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Online Admission Form */}
      <section id="admission-form" className="py-20 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">
              Online Admission Form
            </h2>
            <p className="text-secondary-500 max-w-xl mx-auto">
              Fill in the details below to apply for admission. Fields marked with <span className="text-rose-600 font-medium">*</span> are required.
            </p>
          </motion.div>

          {submitError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-rose-600 mt-0.5 shrink-0" />
              <p className="text-rose-700 text-sm">{submitError}</p>
            </div>
          )}

          <motion.form
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-secondary-100 p-6 md:p-10 shadow-sm space-y-10"
          >
            {/* Student Details */}
            <div>
              <SectionTitle icon={User} title="Student Details" subtitle="Information about the student applying for admission" />
              <div className="grid md:grid-cols-3 gap-4">
                <div data-error={!!errors.studentFirstName}>
                  <label className={labelClass}>First Name <span className="text-rose-600">*</span></label>
                  <input
                    type="text"
                    value={form.studentFirstName}
                    onChange={(e) => handleChange('studentFirstName', e.target.value)}
                    className={inputClass + (errors.studentFirstName ? ' border-rose-400 ring-1 ring-rose-300' : '')}
                    placeholder="e.g. Aarav"
                  />
                  {errors.studentFirstName && <p className="text-rose-600 text-xs mt-1">{errors.studentFirstName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Middle Name</label>
                  <input
                    type="text"
                    value={form.studentMiddleName}
                    onChange={(e) => handleChange('studentMiddleName', e.target.value)}
                    className={inputClass}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    value={form.studentLastName}
                    onChange={(e) => handleChange('studentLastName', e.target.value)}
                    className={inputClass}
                    placeholder="Surname"
                  />
                </div>
                <div data-error={!!errors.studentDob}>
                  <label className={labelClass}>Date of Birth <span className="text-rose-600">*</span></label>
                  <input
                    type="date"
                    value={form.studentDob}
                    onChange={(e) => handleChange('studentDob', e.target.value)}
                    className={inputClass + (errors.studentDob ? ' border-rose-400 ring-1 ring-rose-300' : '')}
                  />
                  {errors.studentDob && <p className="text-rose-600 text-xs mt-1">{errors.studentDob}</p>}
                </div>
                <div data-error={!!errors.studentGender}>
                  <label className={labelClass}>Gender <span className="text-rose-600">*</span></label>
                  <select
                    value={form.studentGender}
                    onChange={(e) => handleChange('studentGender', e.target.value)}
                    className={inputClass + (errors.studentGender ? ' border-rose-400 ring-1 ring-rose-300' : '')}
                  >
                    <option value="">Select gender</option>
                    {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.studentGender && <p className="text-rose-600 text-xs mt-1">{errors.studentGender}</p>}
                </div>
                <div data-error={!!errors.applyingForClass}>
                  <label className={labelClass}>Applying for Class <span className="text-rose-600">*</span></label>
                  <select
                    value={form.applyingForClass}
                    onChange={(e) => handleChange('applyingForClass', e.target.value)}
                    className={inputClass + (errors.applyingForClass ? ' border-rose-400 ring-1 ring-rose-300' : '')}
                  >
                    <option value="">Select class</option>
                    {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.applyingForClass && <p className="text-rose-600 text-xs mt-1">{errors.applyingForClass}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className={labelClass}>Previous School (if any)</label>
                  <input
                    type="text"
                    value={form.previousSchool}
                    onChange={(e) => handleChange('previousSchool', e.target.value)}
                    className={inputClass}
                    placeholder="Name of previous school"
                  />
                </div>
              </div>
            </div>

            {/* Parent / Guardian Details */}
            <div>
              <SectionTitle icon={Users} title="Parent / Guardian Details" subtitle="Contact information for the student's parents or guardians" />
              <div className="grid md:grid-cols-2 gap-6">
                {/* Father */}
                <div className="space-y-4 p-5 bg-secondary-50 rounded-xl">
                  <h4 className="font-heading font-semibold text-secondary-800 text-sm">Father's Details</h4>
                  <div data-error={!!errors.fatherName}>
                    <label className={labelClass}>Full Name <span className="text-rose-600">*</span></label>
                    <input
                      type="text"
                      value={form.fatherName}
                      onChange={(e) => handleChange('fatherName', e.target.value)}
                      className={inputClass + (errors.fatherName ? ' border-rose-400 ring-1 ring-rose-300' : '')}
                      placeholder="Father's full name"
                    />
                    {errors.fatherName && <p className="text-rose-600 text-xs mt-1">{errors.fatherName}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Occupation</label>
                    <input
                      type="text"
                      value={form.fatherOccupation}
                      onChange={(e) => handleChange('fatherOccupation', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Teacher"
                    />
                  </div>
                  <div data-error={!!errors.fatherPhone}>
                    <label className={labelClass}>Phone <span className="text-rose-600">*</span></label>
                    <input
                      type="tel"
                      value={form.fatherPhone}
                      onChange={(e) => handleChange('fatherPhone', e.target.value)}
                      className={inputClass + (errors.fatherPhone ? ' border-rose-400 ring-1 ring-rose-300' : '')}
                      placeholder="98XXXXXXXX"
                    />
                    {errors.fatherPhone && <p className="text-rose-600 text-xs mt-1">{errors.fatherPhone}</p>}
                  </div>
                </div>

                {/* Mother */}
                <div className="space-y-4 p-5 bg-secondary-50 rounded-xl">
                  <h4 className="font-heading font-semibold text-secondary-800 text-sm">Mother's Details</h4>
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      value={form.motherName}
                      onChange={(e) => handleChange('motherName', e.target.value)}
                      className={inputClass}
                      placeholder="Mother's full name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Occupation</label>
                    <input
                      type="text"
                      value={form.motherOccupation}
                      onChange={(e) => handleChange('motherOccupation', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Doctor"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="tel"
                      value={form.motherPhone}
                      onChange={(e) => handleChange('motherPhone', e.target.value)}
                      className={inputClass}
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4" data-error={!!errors.guardianEmail}>
                <label className={labelClass}>Guardian Email <span className="text-rose-600">*</span></label>
                <input
                  type="email"
                  value={form.guardianEmail}
                  onChange={(e) => handleChange('guardianEmail', e.target.value)}
                  className={inputClass + (errors.guardianEmail ? ' border-rose-400 ring-1 ring-rose-300' : '')}
                  placeholder="guardian@example.com"
                />
                {errors.guardianEmail && <p className="text-rose-600 text-xs mt-1">{errors.guardianEmail}</p>}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <SectionTitle icon={Home} title="Additional Information" subtitle="Address and other details" />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2" data-error={!!errors.address}>
                  <label className={labelClass}>Address <span className="text-rose-600">*</span></label>
                  <textarea
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={3}
                    className={inputClass + (errors.address ? ' border-rose-400 ring-1 ring-rose-300' : '')}
                    placeholder="Full residential address"
                  />
                  {errors.address && <p className="text-rose-600 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className={labelClass}>Blood Group</label>
                  <input
                    type="text"
                    value={form.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. O+"
                  />
                </div>
                <div data-error={!!errors.nationality}>
                  <label className={labelClass}>Nationality <span className="text-rose-600">*</span></label>
                  <input
                    type="text"
                    value={form.nationality}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    className={inputClass + (errors.nationality ? ' border-rose-400 ring-1 ring-rose-300' : '')}
                  />
                  {errors.nationality && <p className="text-rose-600 text-xs mt-1">{errors.nationality}</p>}
                </div>
                <div>
                  <label className={labelClass}>How did you hear about us?</label>
                  <select
                    value={form.howDidYouHear}
                    onChange={(e) => handleChange('howDidYouHear', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select an option</option>
                    {hearAboutOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Additional Information</label>
                  <textarea
                    value={form.additionalInfo}
                    onChange={(e) => handleChange('additionalInfo', e.target.value)}
                    rows={3}
                    className={inputClass}
                    placeholder="Any medical conditions, special needs, or other information we should know"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 border-t border-secondary-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-sm transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Submit Application
                  </>
                )}
              </button>
              <p className="text-secondary-400 text-xs text-center mt-3">
                By submitting, you confirm the information provided is accurate. The school will contact you within 2–3 working days.
              </p>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="font-heading font-bold text-3xl text-secondary-900 mb-6">Required Documents</h2>
              <p className="text-secondary-600 mb-8">Please prepare the following documents before visiting the school for admission:</p>
              <ul className="space-y-3">
                {documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-3 text-secondary-700">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{doc}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-800 text-sm font-medium flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  All documents should be submitted as both originals (for verification) and photocopies (to be retained by the school).
                </p>
              </div>
            </motion.div>

            {/* Contact for Admission */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-heading font-bold text-3xl text-secondary-900 mb-6">Contact Admissions</h2>
              <div className="bg-white rounded-2xl border border-secondary-100 p-8 shadow-sm">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={20} className="text-primary-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900 mb-1">Phone</div>
                      <a href="tel:051531919" className="text-primary-600 hover:text-primary-800 font-medium transition-colors">051531919</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-primary-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900 mb-1">Email</div>
                      <a href="mailto:goldenfutureschool29@gmail.com" className="text-primary-600 hover:text-primary-800 font-medium text-sm transition-colors break-all">goldenfutureschool29@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar size={20} className="text-primary-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900 mb-1">Office Hours</div>
                      <div className="text-secondary-600 text-sm">Sunday – Friday: 10:00 AM – 4:00 PM</div>
                      <div className="text-secondary-500 text-sm">Saturday: Closed</div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white w-full py-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    Contact Us <ArrowRight size={15} />
                  </Link>
                  <Link
                    to="/downloads"
                    className="flex items-center justify-center gap-2 border border-secondary-200 hover:border-primary-300 text-secondary-700 hover:text-primary-700 w-full py-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    Download Admission Form
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl text-secondary-900 mb-4">Fee Structure</h2>
            <p className="text-secondary-500">For the current fee structure, please contact the school office directly.</p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-secondary-100 shadow-sm"
          >
            <table className="w-full">
              <thead className="bg-primary-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Admission Fee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Monthly Fee</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {fees.map((fee, i) => (
                  <tr key={fee.class} className={i % 2 === 0 ? 'bg-white' : 'bg-secondary-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-800">{fee.class}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{fee.admission}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{fee.monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="text-secondary-400 text-sm text-center mt-4">
            * Fee structure is subject to change. Contact the school office for the latest fee details.
          </p>
        </div>
      </section>
    </div>
  );
}
