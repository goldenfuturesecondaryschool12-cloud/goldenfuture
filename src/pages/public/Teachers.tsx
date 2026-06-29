import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { TeacherProfile } from '../../types';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const departments = ['All', 'Science', 'Mathematics', 'Social Studies', 'English', 'Nepali', 'Computer', 'Arts & Physical Education'];

function TeacherCard({ teacher }: { teacher: Partial<TeacherProfile> & { name: string; subject: string; qualification: string } }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-secondary-100 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="h-56 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center overflow-hidden">
        {teacher.photoURL ? (
          <img src={teacher.photoURL} alt={teacher.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-24 h-24 bg-primary-200 rounded-full flex items-center justify-center">
            <GraduationCap size={40} className="text-primary-400" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-secondary-900 text-lg mb-1">{teacher.name}</h3>
        <p className="text-primary-600 font-medium text-sm mb-2">{teacher.subject}</p>
        <div className="flex items-center gap-1.5 text-secondary-500 text-xs">
          <GraduationCap size={12} />
          <span>{teacher.qualification}</span>
        </div>
      </div>
    </motion.div>
  );
}


export default function Teachers() {
  useDocumentTitle('Teachers');
  const [selectedDept, setSelectedDept] = useState('All');

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'teacher'), where('isActive', '==', true)));
      return snap.docs.map(d => d.data() as TeacherProfile);
    },
  });

  return (
    <div>
      <PageHeader
        title="Our Teachers"
        subtitle="Meet our dedicated and qualified team of educators committed to shaping the future of every student."
        breadcrumbs={[{ label: 'Home' }, { label: 'Academics' }, { label: 'Our Teachers' }]}
      />

      {/* Team Photo */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
              <Users size={14} /> Our Team
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">The People Behind Our Success</h2>
            <p className="text-secondary-500 max-w-2xl mx-auto">
              Our teachers are experienced, passionate, and dedicated professionals who go above and beyond to support every student's journey.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl mb-12"
          >
            <img
              src="/images/teachers/all_teacher.jpg"
              alt="Golden Future School Teachers"
              className="w-full object-cover max-h-[500px]"
            />
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '40+', label: 'Qualified Teachers' },
              { value: '100%', label: 'Trained Educators' },
              { value: '15+', label: 'Avg. Experience' },
              { value: 'M.Ed.+', label: 'Qualification Level' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-5 bg-primary-50 rounded-2xl">
                <div className="font-heading font-bold text-3xl text-primary-700 mb-1">{stat.value}</div>
                <div className="text-secondary-600 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers from Firestore */}
      {teachers.length > 0 && (
        <section className="py-20 bg-secondary-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
              <h2 className="font-heading font-bold text-3xl text-secondary-900 mb-6">Meet Our Teachers</h2>
              {/* Filter */}
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedDept === dept
                        ? 'bg-primary-700 text-white'
                        : 'bg-white text-secondary-600 border border-secondary-200 hover:border-primary-300 hover:text-primary-700'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </motion.div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array(8).fill(null).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-secondary-100 bg-white h-72 animate-pulse" />
                ))
              ) : (
                teachers.map((teacher, i) => (
                  <TeacherCard
                    key={teacher.uid ?? i}
                    teacher={{
                      name: teacher.displayName,
                      subject: teacher.subjects?.join(', ') ?? teacher.designation,
                      qualification: teacher.qualification,
                      photoURL: teacher.photoURL,
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Teaching Philosophy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">Our Teaching Philosophy</h2>
            <p className="text-secondary-500 max-w-2xl mx-auto">
              Our teachers follow a student-centered, inclusive, and engaging approach to education.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Student-First Approach', desc: 'Every lesson is designed with the student\'s understanding, interest, and pace in mind.', color: 'bg-blue-100 text-blue-600' },
              { icon: Users, title: 'Collaborative Learning', desc: 'We foster teamwork, group discussions, and peer learning for deeper understanding.', color: 'bg-green-100 text-green-600' },
              { icon: GraduationCap, title: 'Continuous Development', desc: 'Our teachers regularly attend training programs and workshops to stay current with best practices.', color: 'bg-amber-100 text-amber-600' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-secondary-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-secondary-900 text-lg mb-2">{item.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
