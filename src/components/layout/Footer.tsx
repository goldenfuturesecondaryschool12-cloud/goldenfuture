import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Youtube, GraduationCap, Heart } from 'lucide-react';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Academics', to: '/academics' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Facilities', to: '/facilities' },
];

const infoLinks = [
  { label: 'News', to: '/news' },
  { label: 'Notices', to: '/notices' },
  { label: 'Events', to: '/events' },
  { label: 'Downloads', to: '/downloads' },
  { label: 'Contact Us', to: '/contact' },
];

const classes = [
  'Nursery', 'LKG', 'UKG',
  'Class 1 – 6', 'Class 7 & 8', 'Class 9 & 10',
];

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src="/school_logo.jpg"
                alt="Golden Future Secondary School"
                className="w-14 h-14 rounded-full object-cover border-2 border-gold-400 shadow-lg"
              />
              <div>
                <div className="font-heading font-bold text-white text-lg leading-tight">Golden Future</div>
                <div className="text-gold-300 text-sm leading-tight">Secondary School</div>
              </div>
            </Link>
            <p className="text-secondary-300 text-sm leading-relaxed mb-5">
              Shaping bright futures through quality education, strong values, and holistic development for every student.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-primary-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-primary-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-5 text-base border-b border-primary-800 pb-3">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-secondary-300 hover:text-gold-300 text-sm transition-colors flex items-center gap-1.5">
                    <span className="text-gold-500">›</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-5 text-base border-b border-primary-800 pb-3">Information</h3>
            <ul className="space-y-2.5">
              {infoLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-secondary-300 hover:text-gold-300 text-sm transition-colors flex items-center gap-1.5">
                    <span className="text-gold-500">›</span> {l.label}
                  </Link>
                </li>
              ))}
              {classes.map((c) => (
                <li key={c}>
                  <span className="text-secondary-300 text-sm flex items-center gap-1.5">
                    <GraduationCap size={12} className="text-gold-500" /> {c}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-5 text-base border-b border-primary-800 pb-3">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span className="text-secondary-300 text-sm leading-relaxed">
                  Shreepur, Birgunj 44300<br />Province No. 2, Nepal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-gold-400 shrink-0" />
                <a href="tel:051531919" className="text-secondary-300 hover:text-gold-300 text-sm transition-colors">
                  051531919
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-gold-400 shrink-0" />
                <a href="mailto:goldenfutureschool29@gmail.com" className="text-secondary-300 hover:text-gold-300 text-sm transition-colors break-all">
                  goldenfutureschool29@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-primary-900 rounded-xl">
              <div className="text-gold-300 font-semibold text-sm mb-1">Office Hours</div>
              <div className="text-secondary-300 text-sm">Sun – Fri: 10:00 AM – 4:00 PM</div>
              <div className="text-secondary-300 text-sm">Saturday: Closed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-secondary-400 text-xs">
            © {new Date().getFullYear()} Golden Future Secondary School. All rights reserved.
          </p>
          <p className="text-secondary-400 text-xs flex items-center gap-1">
            Made with <Heart size={11} className="text-red-400" /> in Birgunj, Nepal
          </p>
        </div>
      </div>
    </footer>
  );
}
