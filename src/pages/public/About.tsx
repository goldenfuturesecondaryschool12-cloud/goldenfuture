import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Trophy, Target, Eye, Heart } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const leadership = [
  {
    name: 'Dr. Umesh Chaurasia',
    role: 'Director',
    image: '/images/staff/director_of_school_Dr.Umesh_Chaurasia.jpg',
    bio: 'Dr. Umesh Chaurasia founded Golden Future Secondary School with a vision to provide world-class education to students of Birgunj and surrounding areas.',
  },
  {
    name: 'Mr. Umesh Sah',
    role: 'Principal',
    image: '/images/staff/principal_Mr.Umesh_Sah.jpg',
    bio: 'Mr. Umesh Sah brings years of experience in education administration, leading the school with dedication, innovation, and care for every student.',
  },
];

const houseSystem = [
  { name: 'Red House', color: 'bg-red-600', light: 'bg-red-50 border-red-200 text-red-700', description: 'Courage, strength, and perseverance' },
  { name: 'Blue House', color: 'bg-blue-600', light: 'bg-blue-50 border-blue-200 text-blue-700', description: 'Wisdom, integrity, and teamwork' },
  { name: 'Green House', color: 'bg-green-600', light: 'bg-green-50 border-green-200 text-green-700', description: 'Growth, harmony, and nature' },
  { name: 'Yellow House', color: 'bg-yellow-500', light: 'bg-yellow-50 border-yellow-200 text-yellow-700', description: 'Joy, creativity, and excellence' },
];

const timeline = [
  { year: '2009 BS', event: 'School founded by Dr. Umesh Chaurasia in Shreepur, Birgunj' },
  { year: '2012 BS', event: 'Expanded to Class 8, added science labs and library' },
  { year: '2015 BS', event: 'Achieved Secondary School (Class 10) status' },
  { year: '2018 BS', event: 'Introduced house system: Red, Blue, Green, Yellow' },
  { year: '2020 BS', event: 'Launched Student Council and democratic election process' },
  { year: '2082 BS', event: 'Serving 800+ students with 40+ qualified teachers' },
];

export default function About() {
  useDocumentTitle('About Us');
  return (
    <div>
      <PageHeader
        title="About Our School"
        subtitle="Learn about our history, mission, values, and the people who make Golden Future a great place to learn."
        breadcrumbs={[{ label: 'Home' }, { label: 'About' }]}
      />

      {/* Mission, Vision, Values */}
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
              Our Mission, Vision & Values
            </h2>
            <p className="text-secondary-500 max-w-2xl mx-auto">
              At Golden Future Secondary School, everything we do is guided by a clear set of principles.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                color: 'bg-primary-50 text-primary-700',
                content: 'To provide accessible, high-quality education that nurtures the intellectual, emotional, and social development of every student, equipping them with the knowledge and values to succeed in life.',
              },
              {
                icon: Eye,
                title: 'Our Vision',
                color: 'bg-gold-50 text-gold-700',
                content: 'To be the leading educational institution in Birgunj — a beacon of excellence where every child reaches their full potential and becomes a responsible, compassionate, and capable citizen.',
              },
              {
                icon: Heart,
                title: 'Our Values',
                color: 'bg-rose-50 text-rose-700',
                content: 'Integrity, Excellence, Respect, Inclusivity, Innovation, and Community. We believe these core values shape not just good students, but great human beings.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-secondary-100 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-5`}>
                  <item.icon size={26} />
                </div>
                <h3 className="font-heading font-bold text-xl text-secondary-900 mb-3">{item.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">Our Journey</h2>
            <p className="text-secondary-500">A timeline of growth, milestones, and achievements</p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 md:transform md:-translate-x-px" />
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="hidden md:block flex-1" />
                <div className="relative z-10 w-5 h-5 bg-primary-600 rounded-full border-4 border-white shadow-md shrink-0 ml-5 md:ml-0" />
                <div className="flex-1 md:max-w-xs">
                  <div className={`bg-white rounded-xl p-5 shadow-sm border border-secondary-100 ${i % 2 === 0 ? 'md:ml-0' : 'md:mr-0'}`}>
                    <div className="font-heading font-bold text-primary-700 text-sm mb-2">{item.year}</div>
                    <p className="text-secondary-700 text-sm leading-relaxed">{item.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">Our Leadership</h2>
            <p className="text-secondary-500 max-w-xl mx-auto">
              Guided by experienced and dedicated leaders committed to the school's vision.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((person, i) => (
              <motion.div
                key={person.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl border border-secondary-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-64 overflow-hidden bg-secondary-100">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <div className="font-heading font-bold text-xl text-secondary-900 mb-1">{person.name}</div>
                  <div className="text-primary-600 font-semibold text-sm mb-3">{person.role}</div>
                  <p className="text-secondary-600 text-sm leading-relaxed">{person.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* House System */}
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
              <Trophy size={14} />
              House System
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">
              Four Houses, One School
            </h2>
            <p className="text-secondary-500 max-w-2xl mx-auto">
              Our house system fosters healthy competition, teamwork, and school spirit among all students.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {houseSystem.map((house, i) => (
              <motion.div
                key={house.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border-2 ${house.light} text-center`}
              >
                <div className={`w-16 h-16 ${house.color} rounded-full mx-auto mb-4 shadow-lg`} />
                <h3 className="font-heading font-bold text-lg mb-2">{house.name}</h3>
                <p className="text-sm opacity-80">{house.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '800+', label: 'Students', icon: Users },
              { value: '40+', label: 'Teachers', icon: GraduationCap },
              { value: '13', label: 'Classes', icon: BookOpen },
              { value: '15+', label: 'Years', icon: Trophy },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <s.icon size={24} className="text-gold-300" />
                </div>
                <div className="font-heading font-bold text-4xl text-white mb-1">{s.value}</div>
                <div className="text-primary-300 text-sm font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
