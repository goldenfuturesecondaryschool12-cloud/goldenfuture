import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, GraduationCap, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

const roleBadges = [
  { role: 'Super Admin', color: 'bg-purple-100 text-purple-700' },
  { role: 'Admin', color: 'bg-blue-100 text-blue-700' },
  { role: 'Principal', color: 'bg-amber-100 text-amber-700' },
  { role: 'Teacher', color: 'bg-green-100 text-green-700' },
  { role: 'Student', color: 'bg-cyan-100 text-cyan-700' },
  { role: 'Parent', color: 'bg-rose-100 text-rose-700' },
  { role: 'Staff', color: 'bg-secondary-100 text-secondary-700' },
];

const dashboardRoutes: Record<string, string> = {
  superadmin: '/erp/superadmin',
  admin: '/erp/admin',
  principal: '/erp/principal',
  teacher: '/erp/teacher',
  student: '/erp/student',
  parent: '/erp/parent',
  staff: '/erp/staff',
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, role, loading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  // Redirect immediately if already authenticated (covers both:
  //   1. already-logged-in user who lands on /login
  //   2. just-logged-in user once role loads from Firestore
  // )
  useEffect(() => {
    if (!loading && role) {
      navigate(dashboardRoutes[role] || '/erp', { replace: true });
    }
  }, [loading, role, navigate]);

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      // AuthContext's onAuthStateChanged will load the profile and set role,
      // which triggers the useEffect above to redirect.
    } catch (err: any) {
      const code = err?.code || '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password. Please try again.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
      setSubmitting(false);
    }
  };

  // Show a clean loading screen while auth state resolves on initial page load
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/school_logo.jpg"
            alt="Golden Future Secondary School"
            className="w-20 h-20 rounded-full object-cover border-2 border-gold-400 mx-auto mb-5 shadow-xl"
          />
          <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
          <p className="text-primary-300 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Back to website */}
        <Link
          to="/"
          className="flex items-center gap-2 text-primary-300 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Website
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary-900 to-primary-800 px-8 py-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/school_logo.jpg"
                alt="Golden Future Secondary School"
                className="w-16 h-16 rounded-full object-cover border-2 border-gold-400 shadow-lg"
              />
            </div>
            <h1 className="font-heading font-bold text-2xl text-white mb-1">ERP Portal</h1>
            <p className="text-primary-300 text-sm">Golden Future Secondary School</p>
          </div>

          <div className="px-8 py-8">
            {/* Role badges */}
            <div className="flex flex-wrap gap-1.5 justify-center mb-8">
              {roleBadges.map((r) => (
                <span key={r.role} className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.color}`}>
                  {r.role}
                </span>
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2"
              >
                <Shield size={15} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            {/* Show redirecting state after successful login while role loads */}
            {submitting && !error && (
              <div className="mb-5 p-4 bg-primary-50 border border-primary-100 rounded-xl text-primary-700 text-sm flex items-center gap-3">
                <span className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin shrink-0" />
                Signing in — redirecting to your portal...
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                  })}
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full border border-secondary-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full border border-secondary-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md text-sm"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={16} /> Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-secondary-50 rounded-xl">
              <p className="text-secondary-500 text-xs text-center">
                Account access is provided by the school administration only.
                Contact the school office for login credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="tel:051531919"
            className="text-primary-300 hover:text-white text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <GraduationCap size={14} /> Golden Future Secondary School · 051531919
          </a>
        </div>
      </motion.div>
    </div>
  );
}
