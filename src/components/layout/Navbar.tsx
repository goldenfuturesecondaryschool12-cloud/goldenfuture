import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail, GraduationCap, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Academics',
    to: '/academics',
    children: [
      { label: 'Academic Programs', to: '/academics' },
      { label: 'Principal Message', to: '/principal-message' },
      { label: 'Our Teachers', to: '/teachers' },
    ],
  },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Facilities', to: '/facilities' },
  {
    label: 'Student Life',
    to: '#',
    children: [
      { label: 'Student Council', to: '/student-council' },
      { label: 'Election', to: '/election' },
      { label: 'Gallery', to: '/gallery' },
    ],
  },
  {
    label: 'Updates',
    to: '#',
    children: [
      { label: 'News', to: '/news' },
      { label: 'Notices', to: '/notices' },
      { label: 'Events', to: '/events' },
      { label: 'Downloads', to: '/downloads' },
    ],
  },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-900 text-white text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:051531919" className="flex items-center gap-1.5 hover:text-gold-300 transition-colors">
              <Phone size={13} />
              <span>051531919</span>
            </a>
            <a href="mailto:goldenfutureschool29@gmail.com" className="flex items-center gap-1.5 hover:text-gold-300 transition-colors">
              <Mail size={13} />
              <span>goldenfutureschool29@gmail.com</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-gold-300 font-medium">
            <GraduationCap size={14} />
            <span>Shreepur, Birgunj 44300, Nepal</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button onClick={handleLogoClick} className="flex items-center gap-3 group">
              <img
                src="/school_logo.jpg"
                alt="Golden Future Secondary School Logo"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-primary-600 group-hover:border-gold-500 transition-colors shadow-md"
              />
              <div className="hidden sm:block">
                <div className="font-heading font-bold text-primary-900 text-base md:text-lg leading-tight group-hover:text-primary-700 transition-colors">
                  Golden Future
                </div>
                <div className="text-xs md:text-sm text-secondary-500 font-medium leading-tight">
                  Secondary School
                </div>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-secondary-700 hover:text-primary-700 rounded-lg hover:bg-primary-50 transition-all">
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-secondary-100 py-1.5 z-50"
                        >
                          {link.children.map((child) => (
                            <NavLink
                              key={child.to}
                              to={child.to}
                              className={({ isActive }) =>
                                `block px-4 py-2.5 text-sm transition-colors ${isActive ? 'text-primary-700 bg-primary-50 font-medium' : 'text-secondary-700 hover:text-primary-700 hover:bg-primary-50'}`
                              }
                              onClick={() => setActiveDropdown(null)}
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `px-3 py-2 text-sm font-medium rounded-lg transition-all ${isActive ? 'text-primary-700 bg-primary-50' : 'text-secondary-700 hover:text-primary-700 hover:bg-primary-50'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </div>

            {/* ERP Login + mobile menu */}
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <LogIn size={15} />
                <span>ERP Login</span>
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-secondary-700 hover:bg-secondary-100 transition-colors"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-secondary-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
                {/* Mobile top bar info */}
                <div className="pb-3 mb-2 border-b border-secondary-100">
                  <a href="tel:051531919" className="flex items-center gap-2 text-sm text-secondary-600 py-1">
                    <Phone size={13} /> 051531919
                  </a>
                  <a href="mailto:goldenfutureschool29@gmail.com" className="flex items-center gap-2 text-sm text-secondary-600 py-1">
                    <Mail size={13} /> goldenfutureschool29@gmail.com
                  </a>
                </div>
                {navLinks.map((link) =>
                  link.children ? (
                    <MobileDropdown key={link.label} link={link} onClose={() => setMobileOpen(false)} />
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-primary-700 bg-primary-50' : 'text-secondary-700 hover:text-primary-700 hover:bg-secondary-50'}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold mt-2"
                >
                  <LogIn size={15} /> ERP Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

function MobileDropdown({ link, onClose }: { link: typeof navLinks[0]; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
      >
        {link.label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 overflow-hidden"
          >
            {link.children?.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm rounded-lg transition-colors ${isActive ? 'text-primary-700 bg-primary-50 font-medium' : 'text-secondary-600 hover:text-primary-700 hover:bg-secondary-50'}`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
