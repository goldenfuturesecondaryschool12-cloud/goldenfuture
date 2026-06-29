import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, FlaskConical, Music, Dumbbell, Palette, Calculator, Globe, Microscope } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const programs = [
  {
    level: 'Early Childhood (Nursery – UKG)',
    classes: ['Nursery', 'LKG', 'UKG'],
    description: 'Our early childhood program focuses on play-based learning, foundational literacy and numeracy, social skills, creativity, and emotional development.',
    features: ['Activity-based learning', 'Phonics & early reading', 'Arts, crafts & music', 'Physical development', 'Social skills building'],
    color: 'border-pink-200 bg-pink-50',
    accent: 'text-pink-600 bg-pink-100',
  },
  {
    level: 'Primary Level (Class 1 – 6)',
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'],
    description: 'The primary program builds strong academic foundations across all core subjects following the CDC Nepal curriculum with enhanced learning activities.',
    features: ['Nepali, English & Maths', 'Science & Social Studies', 'Moral Education', 'Computer basics', 'Physical Education & Arts'],
    color: 'border-blue-200 bg-blue-50',
    accent: 'text-blue-600 bg-blue-100',
  },
  {
    level: 'Lower Secondary (Class 7 – 8)',
    classes: ['Class 7 Section A & B', 'Class 8 Section A & B'],
    description: 'Students transition to subject-specific learning with two sections per class, preparing for the rigor of secondary education.',
    features: ['Section A & B per class', 'Science & Mathematics', 'Social Studies & HPE', 'Nepali & English', 'Computer Science'],
    color: 'border-amber-200 bg-amber-50',
    accent: 'text-amber-600 bg-amber-100',
  },
  {
    level: 'Secondary Level (Class 9 – 10)',
    classes: ['Class 9 Section A & B', 'Class 10 Section A & B'],
    description: 'Comprehensive SEE preparation with dedicated subject teachers, regular assessments, and career guidance for students.',
    features: ['SEE board exam preparation', 'Optional Mathematics', 'Science & Technology', 'Social Studies', 'Career counseling'],
    color: 'border-green-200 bg-green-50',
    accent: 'text-green-600 bg-green-100',
  },
];

const subjects = [
  { name: 'Mathematics', icon: Calculator, color: 'bg-blue-100 text-blue-600' },
  { name: 'Science', icon: Microscope, color: 'bg-green-100 text-green-600' },
  { name: 'English', icon: Globe, color: 'bg-purple-100 text-purple-600' },
  { name: 'Social Studies', icon: BookOpen, color: 'bg-amber-100 text-amber-600' },
  { name: 'Computer Science', icon: Calculator, color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Physical Education', icon: Dumbbell, color: 'bg-rose-100 text-rose-600' },
  { name: 'Arts & Crafts', icon: Palette, color: 'bg-pink-100 text-pink-600' },
  { name: 'Music', icon: Music, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Lab Science', icon: FlaskConical, color: 'bg-teal-100 text-teal-600' },
];

export default function Academics() {
  useDocumentTitle('Academics');
  return (
    <div>
      <PageHeader
        title="Academic Programs"
        subtitle="A comprehensive curriculum from Nursery to Class 10, designed to nurture every aspect of student development."
        breadcrumbs={[{ label: 'Home' }, { label: 'Academics' }]}
      />

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
                <GraduationCap size={14} /> Our Curriculum
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-6">
                Education That Prepares Students for Life
              </h2>
              <p className="text-secondary-600 leading-relaxed mb-4">
                Golden Future Secondary School follows the curriculum prescribed by the Curriculum Development Centre (CDC), Nepal. We enhance this with co-curricular activities, practical labs, and regular assessments.
              </p>
              <p className="text-secondary-600 leading-relaxed mb-6">
                Our teaching methodology combines traditional best practices with modern pedagogical approaches. We use interactive teaching, group projects, and technology integration to make learning engaging and effective.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'CDC Curriculum', desc: 'Government approved' },
                  { label: 'Regular Exams', desc: 'CAS system implemented' },
                  { label: 'Parent Connect', desc: 'Regular meetings' },
                  { label: 'Extra Classes', desc: 'SEE preparation' },
                ].map((item) => (
                  <div key={item.label} className="p-4 bg-secondary-50 rounded-xl">
                    <div className="font-semibold text-secondary-900 text-sm">{item.label}</div>
                    <div className="text-secondary-500 text-xs mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img
                src="/images/staff/director_of_school_Dr.Umesh_Chaurasia.jpg"
                alt="Teaching at Golden Future"
                className="rounded-2xl shadow-xl w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">Academic Levels</h2>
            <p className="text-secondary-500 max-w-xl mx-auto">
              Four distinct educational levels, each tailored to the developmental stage of our students.
            </p>
          </motion.div>
          <div className="space-y-8">
            {programs.map((prog, i) => (
              <motion.div
                key={prog.level}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border-2 ${prog.color} p-8`}
              >
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="font-heading font-bold text-2xl text-secondary-900 mb-2">{prog.level}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {prog.classes.map((c) => (
                        <span key={c} className={`text-xs font-semibold px-3 py-1 rounded-full ${prog.accent}`}>
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="text-secondary-600 leading-relaxed">{prog.description}</p>
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-700 text-sm mb-3">Key Features</div>
                    <ul className="space-y-2">
                      {prog.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-secondary-600">
                          <span className="text-green-500 mt-0.5">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">Subjects Offered</h2>
            <p className="text-secondary-500 max-w-xl mx-auto">
              A wide range of subjects ensuring holistic development across academic, creative, and physical domains.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {subjects.map((subj, i) => (
              <motion.div
                key={subj.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl border border-secondary-100 bg-white hover:shadow-md transition-shadow text-center"
              >
                <div className={`w-12 h-12 ${subj.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <subj.icon size={20} />
                </div>
                <div className="font-semibold text-secondary-800 text-sm">{subj.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam System */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">Assessment System</h2>
            <p className="text-primary-200 max-w-xl mx-auto">
              We follow the Continuous Assessment System (CAS) as prescribed by CDC, Nepal.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Unit Tests', desc: 'Monthly assessments to track learning progress', marks: '20 marks' },
              { title: 'Mid-Term Exam', desc: 'Half-yearly comprehensive evaluation', marks: '75 marks' },
              { title: 'Final Exam', desc: 'End-of-year summative assessment', marks: '75 marks' },
              { title: 'Pre-Board (Class 10)', desc: 'SEE mock examination for preparation', marks: 'Full marks' },
            ].map((exam, i) => (
              <motion.div
                key={exam.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6"
              >
                <div className="font-heading font-bold text-xl text-white mb-2">{exam.title}</div>
                <p className="text-primary-200 text-sm leading-relaxed mb-4">{exam.desc}</p>
                <span className="inline-block bg-gold-500/20 text-gold-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {exam.marks}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
