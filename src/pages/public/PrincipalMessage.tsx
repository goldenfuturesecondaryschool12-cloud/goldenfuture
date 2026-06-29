import { motion } from 'framer-motion';
import { Quote, GraduationCap, Star, Award } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function PrincipalMessage() {
  useDocumentTitle("Principal's Message");
  return (
    <div>
      <PageHeader
        title="Principal's Message"
        subtitle="A word of guidance, inspiration, and vision from the leadership of Golden Future Secondary School."
        breadcrumbs={[{ label: 'Home' }, { label: 'Academics' }, { label: "Principal's Message" }]}
      />

      {/* Director's Message */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/images/staff/director_of_school_Dr.Umesh_Chaurasia.jpg"
                alt="Dr. Umesh Chaurasia - Director"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto object-cover"
              />
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-5 border border-secondary-100 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center">
                    <Award size={18} className="text-gold-600" />
                  </div>
                  <div>
                    <div className="font-bold text-secondary-900 text-sm">Dr. Umesh Chaurasia</div>
                    <div className="text-secondary-500 text-xs">Founder & Director</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
                <Star size={14} /> Director's Message
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-2">
                Dr. Umesh Chaurasia
              </h2>
              <p className="text-primary-600 font-semibold mb-6">Founder & Director, Golden Future Secondary School</p>

              <div className="relative mb-6">
                <Quote size={32} className="text-primary-200 mb-2" />
                <p className="text-secondary-700 leading-relaxed text-lg italic">
                  "I founded Golden Future Secondary School with a singular dream: to create a place where every child, regardless of their background, could receive a world-class education and grow into their fullest potential."
                </p>
              </div>

              <div className="space-y-4 text-secondary-600 leading-relaxed">
                <p>
                  Education is the most powerful gift we can give to our children. At Golden Future, we don't just teach subjects — we nurture thinkers, creators, leaders, and compassionate human beings who will shape the future of Nepal and beyond.
                </p>
                <p>
                  Our school is built on the belief that every student is unique, with their own strengths, passions, and potential. Our dedicated team of teachers works tirelessly to discover and develop those strengths, creating personalized pathways to success.
                </p>
                <p>
                  I invite every parent, student, and community member to be part of our journey. Together, we can build golden futures — not just for our students, but for our entire community.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <img
                  src="/images/staff/director_of_school_Dr.Umesh_Chaurasia.jpg"
                  alt="Dr. Umesh Chaurasia"
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-200"
                />
                <div>
                  <div className="font-heading font-bold text-secondary-900">Dr. Umesh Chaurasia</div>
                  <div className="text-secondary-500 text-sm">Founder & Director</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-secondary-100 max-w-7xl mx-auto" />

      {/* Principal's Message */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
                <GraduationCap size={14} /> Principal's Message
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-2">
                Mr. Umesh Sah
              </h2>
              <p className="text-primary-600 font-semibold mb-6">Principal, Golden Future Secondary School</p>

              <div className="relative mb-6">
                <Quote size={32} className="text-primary-200 mb-2" />
                <p className="text-secondary-700 leading-relaxed text-lg italic">
                  "Education is not just about academic excellence. It is about building character, instilling values, and preparing our students to become responsible citizens who contribute positively to society."
                </p>
              </div>

              <div className="space-y-4 text-secondary-600 leading-relaxed">
                <p>
                  Dear Students, Parents, and Well-Wishers, I am honored to lead Golden Future Secondary School — an institution that has been transforming lives and building futures since its founding. Our school is more than a place of learning; it is a community of growth.
                </p>
                <p>
                  We are committed to providing an environment where students feel safe, supported, and inspired to achieve their best. Our teachers are not just educators — they are mentors, guides, and role models who invest personally in every student's success.
                </p>
                <p>
                  We believe in the holistic development of our students. Beyond academics, we provide opportunities in sports, arts, cultural activities, and leadership through our student council and house system. These experiences shape confident, well-rounded individuals.
                </p>
                <p>
                  I look forward to working with each family and student to make this year extraordinary. Together, we will achieve golden futures.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <img
                  src="/images/staff/principal_Mr.Umesh_Sah.jpg"
                  alt="Mr. Umesh Sah"
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-200"
                />
                <div>
                  <div className="font-heading font-bold text-secondary-900">Mr. Umesh Sah</div>
                  <div className="text-secondary-500 text-sm">Principal</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="relative"
            >
              <img
                src="/images/staff/principal_Mr.Umesh_Sah.jpg"
                alt="Mr. Umesh Sah - Principal"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto object-cover"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-5 border border-secondary-100 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <GraduationCap size={18} className="text-primary-700" />
                  </div>
                  <div>
                    <div className="font-bold text-secondary-900 text-sm">Mr. Umesh Sah</div>
                    <div className="text-secondary-500 text-xs">Principal</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values cards */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-secondary-900">Our Leadership Philosophy</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Student-Centered', desc: 'Every decision we make puts the student\'s growth, safety, and happiness first.' },
              { title: 'Academic Rigor', desc: 'High expectations and strong support systems ensure every student reaches their potential.' },
              { title: 'Inclusive Community', desc: 'We welcome every student and family, celebrating diversity and fostering belonging.' },
              { title: 'Character Building', desc: 'Beyond grades, we develop honest, responsible, and compassionate individuals.' },
              { title: 'Teacher Excellence', desc: 'We invest in our teachers\' professional development to deliver the best education.' },
              { title: 'Parent Partnership', desc: 'Parents are our partners in education. Open communication is central to our approach.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-100"
              >
                <h3 className="font-heading font-bold text-secondary-900 text-lg mb-2">{item.title}</h3>
                <p className="text-secondary-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
