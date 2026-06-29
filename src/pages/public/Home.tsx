import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Users, BookOpen, Trophy, ChevronRight,
  Star, Phone, Mail, MapPin, ArrowRight, Award, Heart, Lightbulb
} from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const stats = [
  { label: 'Students Enrolled', value: '800+', icon: Users },
  { label: 'Qualified Teachers', value: '40+', icon: GraduationCap },
  { label: 'Years of Excellence', value: '15+', icon: Star },
  { label: 'Academic Programs', value: '13', icon: BookOpen },
];

const values = [
  {
    icon: Award,
    title: 'Excellence',
    desc: 'We strive for the highest standards in academics and character development.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Heart,
    title: 'Care & Respect',
    desc: 'Every student is valued, supported, and nurtured in a safe environment.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Modern teaching methods that prepare students for the future.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Trophy,
    title: 'Achievement',
    desc: 'Celebrating every milestone and inspiring students to reach greater heights.',
    color: 'bg-emerald-50 text-emerald-600',
  },
];

const classes = [
  { name: 'Nursery', desc: 'Playful early learning environment', ageGroup: '3–4 years' },
  { name: 'LKG', desc: 'Building foundations of learning', ageGroup: '4–5 years' },
  { name: 'UKG', desc: 'Preparing for primary education', ageGroup: '5–6 years' },
  { name: 'Class 1–6', desc: 'Comprehensive primary education', ageGroup: '6–12 years' },
  { name: 'Class 7–8', desc: 'Middle school with two sections', ageGroup: '12–14 years' },
  { name: 'Class 9–10', desc: 'SEE preparation & career guidance', ageGroup: '14–16 years' },
];

const recentNews = [
  {
    title: 'Happy New Year 2083 – Celebration at Golden Future',
    date: 'Baisakh 1, 2083',
    excerpt: 'Golden Future Secondary School celebrated the Nepali New Year with great enthusiasm, cultural programs, and community gathering.',
  },
  {
    title: 'Annual Sports Day – A Grand Success',
    date: 'Falgun 20, 2082',
    excerpt: 'Students showcased their athletic talent across various sports disciplines in our annual sports day event.',
  },
  {
    title: 'Science Exhibition 2082 – Innovations on Display',
    date: 'Poush 15, 2082',
    excerpt: 'Brilliant young minds presented innovative projects at our annual science exhibition, impressing judges and parents alike.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  useDocumentTitle();
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/gallery/assembly.jpg"
            alt="Golden Future School"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/70 to-primary-800/50" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/30 text-gold-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Star size={14} />
              Shreepur, Birgunj 44300, Nepal
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6"
            >
              Golden Future{' '}
              <span className="text-gold-400">Secondary School</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-primary-200 text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
            >
              Nurturing young minds with quality education, strong values, and holistic development from Nursery to Class 10.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/admissions"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-gold-500/25 hover:shadow-xl text-sm sm:text-base"
              >
                Apply for Admission <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white hover:bg-white/10 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm sm:text-base"
              >
                Learn More <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60H1440V20C1440 20 1200 0 720 0C240 0 0 20 0 20V60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-primary-50 border border-primary-100"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={22} className="text-primary-700" />
                </div>
                <div className="font-heading font-bold text-3xl text-primary-900 mb-1">{stat.value}</div>
                <div className="text-secondary-500 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
                <GraduationCap size={14} />
                About Our School
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-6">
                Building Bright Futures Since Our Founding
              </h2>
              <p className="text-secondary-600 leading-relaxed mb-4">
                Golden Future Secondary School, located in Shreepur, Birgunj, is dedicated to providing quality education from Nursery through Class 10. Our school fosters intellectual curiosity, creativity, and character in every student.
              </p>
              <p className="text-secondary-600 leading-relaxed mb-8">
                With experienced teachers, modern facilities, and a student-centered approach, we prepare our students not just for examinations, but for life. Our four house system — Red, Blue, Green, and Yellow — encourages healthy competition and team spirit.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  Read More <ArrowRight size={14} />
                </Link>
                <Link
                  to="/principal-message"
                  className="inline-flex items-center gap-2 border border-secondary-200 hover:border-primary-300 text-secondary-700 hover:text-primary-700 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  Principal's Message
                </Link>
              </div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <img
                src="/images/gallery/assembly.jpg"
                alt="School Community"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-5 border border-secondary-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
                    <Trophy size={20} className="text-gold-600" />
                  </div>
                  <div>
                    <div className="font-bold text-secondary-900 text-sm">SEE Excellence</div>
                    <div className="text-secondary-500 text-xs">Consistent top results</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
              <Heart size={14} />
              Our Core Values
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900">
              What We Stand For
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${v.color} rounded-xl flex items-center justify-center mb-4`}>
                  <v.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-secondary-900 text-lg mb-2">{v.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
              <BookOpen size={14} />
              Academic Programs
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">
              From Nursery to Class 10
            </h2>
            <p className="text-secondary-500 max-w-2xl mx-auto">
              We offer a comprehensive curriculum designed to meet the developmental needs of every student at every stage.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, i) => (
              <motion.div
                key={cls.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group p-6 rounded-2xl border border-secondary-100 hover:border-primary-200 hover:shadow-lg transition-all bg-white"
              >
                <div className="w-10 h-10 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <GraduationCap size={18} className="text-primary-700" />
                </div>
                <h3 className="font-heading font-bold text-secondary-900 text-lg mb-1">{cls.name}</h3>
                <p className="text-secondary-500 text-sm mb-3">{cls.desc}</p>
                <span className="inline-block bg-gold-100 text-gold-700 text-xs font-medium px-3 py-1 rounded-full">
                  {cls.ageGroup}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/academics"
              className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            >
              View Full Curriculum <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Principal Snippet */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-gold-300 font-semibold text-sm bg-white/10 px-3 py-1.5 rounded-full mb-4">
                <Star size={14} />
                Principal's Message
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
                A Word from Our Principal
              </h2>
              <blockquote className="text-primary-200 leading-relaxed text-lg italic mb-6 border-l-4 border-gold-400 pl-5">
                "Education is not just about academic excellence. It is about building character, instilling values, and preparing our students to become responsible citizens who contribute positively to society."
              </blockquote>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/images/staff/principal_Mr.Umesh_Sah.jpg"
                  alt="Principal Mr. Umesh Sah"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gold-400 shadow-lg"
                />
                <div>
                  <div className="font-semibold text-white">Mr. Umesh Sah</div>
                  <div className="text-gold-300 text-sm">Principal, Golden Future Secondary School</div>
                </div>
              </div>
              <Link
                to="/principal-message"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold px-5 py-3 rounded-xl text-sm transition-all"
              >
                Read Full Message <ArrowRight size={14} />
              </Link>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <img
                src="/images/staff/principal_Mr.Umesh_Sah.jpg"
                alt="Principal"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent News */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
                <Star size={14} />
                Latest Updates
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900">
                News & Events
              </h2>
            </div>
            <Link to="/news" className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-800 font-semibold text-sm transition-colors">
              View All <ChevronRight size={16} />
            </Link>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {recentNews.map((news, i) => (
              <motion.div
                key={news.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-secondary-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                  <BookOpen size={48} className="text-primary-300" />
                </div>
                <div className="p-5">
                  <div className="text-xs text-secondary-400 font-medium mb-2">{news.date}</div>
                  <h3 className="font-heading font-bold text-secondary-900 text-base mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-secondary-500 text-sm leading-relaxed line-clamp-3">{news.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/news" className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm">
              View All News <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-10 md:p-14 text-white text-center"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Ready to Join Our School?</h2>
            <p className="text-primary-200 text-lg mb-8 max-w-xl mx-auto">
              Admissions are open. Come visit us or reach out to learn more about enrolling your child.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a href="tel:051531919" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all">
                <Phone size={15} /> 051531919
              </a>
              <a href="mailto:goldenfutureschool29@gmail.com" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all">
                <Mail size={15} /> goldenfutureschool29@gmail.com
              </a>
              <Link to="/contact" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all">
                <MapPin size={15} /> Visit Us
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/admissions"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg"
              >
                Apply Now <ArrowRight size={14} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
