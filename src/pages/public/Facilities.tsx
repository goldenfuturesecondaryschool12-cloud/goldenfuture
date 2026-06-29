import { motion } from 'framer-motion';
import { FlaskConical, BookOpen, Dumbbell, Monitor, Music, Palette, Bus, Utensils, Shield, Wifi } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const facilities = [
  {
    icon: FlaskConical,
    title: 'Science Laboratories',
    desc: 'Well-equipped Physics, Chemistry, and Biology labs where students conduct hands-on experiments aligned with their curriculum.',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: BookOpen,
    title: 'School Library',
    desc: 'A rich collection of textbooks, reference books, novels, and educational resources available to all students and staff.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Monitor,
    title: 'Computer Lab',
    desc: 'Modern computer lab with internet connectivity providing students hands-on experience in digital literacy and technology.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Dumbbell,
    title: 'Sports Ground',
    desc: 'Spacious grounds for cricket, football, volleyball, and athletics. Inter-house competitions are held regularly.',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    icon: Music,
    title: 'Music & Arts Room',
    desc: 'Dedicated spaces for music, dance, and visual arts where students explore their creativity and cultural heritage.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: Palette,
    title: 'Smart Classrooms',
    desc: 'Classrooms equipped with projectors and smart boards to deliver engaging, multimedia-enhanced lessons.',
    color: 'bg-cyan-100 text-cyan-700',
  },
  {
    icon: Utensils,
    title: 'Canteen',
    desc: 'A clean and hygienic school canteen serving nutritious snacks and meals during break times.',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    icon: Bus,
    title: 'Transport Facility',
    desc: 'Safe and reliable school bus service covering major routes in Birgunj and surrounding areas.',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    icon: Shield,
    title: 'Safe Campus',
    desc: 'CCTV surveillance, trained security personnel, and strict visitor policies ensure a safe environment for all students.',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    icon: Wifi,
    title: 'Wi-Fi Campus',
    desc: 'High-speed internet connectivity across the campus for modern digital learning and administrative efficiency.',
    color: 'bg-sky-100 text-sky-700',
  },
];

export default function Facilities() {
  useDocumentTitle('Facilities');
  return (
    <div>
      <PageHeader
        title="Our Facilities"
        subtitle="World-class infrastructure and modern amenities designed to create the best learning environment for our students."
        breadcrumbs={[{ label: 'Home' }, { label: 'Facilities' }]}
      />

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1.5 rounded-full mb-4">
                <Shield size={14} /> World-Class Infrastructure
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-6">
                A Campus Built for Learning
              </h2>
              <p className="text-secondary-600 leading-relaxed mb-4">
                Golden Future Secondary School is equipped with modern facilities that support both academic excellence and personal development. Our campus is designed to be a safe, stimulating, and inspiring environment.
              </p>
              <p className="text-secondary-600 leading-relaxed mb-6">
                From well-stocked laboratories to creative arts spaces, from a comprehensive library to modern sports facilities — every amenity is maintained to the highest standard for our students' benefit.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary-50 rounded-xl text-center">
                  <div className="font-heading font-bold text-2xl text-primary-700">10+</div>
                  <div className="text-secondary-600 text-sm">Facilities</div>
                </div>
                <div className="p-4 bg-gold-50 rounded-xl text-center">
                  <div className="font-heading font-bold text-2xl text-gold-700">Safe</div>
                  <div className="text-secondary-600 text-sm">CCTV Campus</div>
                </div>
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
                src="/images/gallery/assembly.jpg"
                alt="Golden Future School Campus"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-secondary-900 mb-4">
              All Our Facilities
            </h2>
            <p className="text-secondary-500 max-w-xl mx-auto">
              Everything our students need for a complete and enriching educational experience.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {facilities.map((facility, i) => (
              <motion.div
                key={facility.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-6 border border-secondary-100 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 ${facility.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <facility.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-secondary-900 text-base mb-2">{facility.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{facility.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-heading font-bold text-3xl text-white mb-4">
              Experience It Yourself
            </h2>
            <p className="text-primary-200 mb-8 max-w-xl mx-auto">
              We invite you to schedule a campus tour and see our world-class facilities for yourself. Prospective students and parents are always welcome.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:051531919"
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Call to Schedule a Visit
              </a>
              <a
                href="mailto:goldenfutureschool29@gmail.com"
                className="flex items-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
