import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Phone, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const defaultFAQs = [
  {
    id: '1',
    category: 'Admissions',
    question: 'What are the age requirements for Nursery admission?',
    answer: 'Children must be at least 3 years old by the time of admission to join our Nursery program. For LKG, the minimum age is 4 years, and for UKG, it is 5 years.',
    order: 1,
  },
  {
    id: '2',
    category: 'Admissions',
    question: 'What documents are required for admission?',
    answer: 'Required documents include the birth certificate, citizenship of parent/guardian, recent passport-size photographs, transfer certificate (for students from other schools), character certificate, and mark sheet from the previous class.',
    order: 2,
  },
  {
    id: '3',
    category: 'Admissions',
    question: 'Is there an entrance exam for admission?',
    answer: 'Students applying for Nursery to UKG undergo an informal interaction/assessment. Students applying for Class 1 and above may be required to appear in a basic assessment to determine appropriate grade placement.',
    order: 3,
  },
  {
    id: '4',
    category: 'Academics',
    question: 'What curriculum does the school follow?',
    answer: 'Golden Future Secondary School follows the National Curriculum prescribed by the Curriculum Development Centre (CDC), Nepal. We supplement this with additional learning activities, practical labs, and co-curricular programs.',
    order: 4,
  },
  {
    id: '5',
    category: 'Academics',
    question: 'Does the school offer classes on Saturday?',
    answer: 'No, the school is closed on Saturdays. Our school week runs from Sunday to Friday. Office hours are 10:00 AM to 4:00 PM.',
    order: 5,
  },
  {
    id: '6',
    category: 'Academics',
    question: 'How is student performance assessed?',
    answer: 'We follow the Continuous Assessment System (CAS) as mandated by the CDC. This includes unit tests, mid-term examinations, final examinations, and project-based assessments. Class 10 students appear in the SEE (Secondary Education Examination) conducted by NEB.',
    order: 6,
  },
  {
    id: '7',
    category: 'Fees',
    question: 'How can I pay school fees?',
    answer: 'Fees can be paid in person at the school accounts office. Please contact the school at 051531919 or visit the office during school hours for the current fee schedule and payment options.',
    order: 7,
  },
  {
    id: '8',
    category: 'Fees',
    question: 'Are there any scholarships available?',
    answer: 'Yes, Golden Future Secondary School offers merit-based and need-based fee concessions. Please contact the school administration for details about eligibility and application procedures.',
    order: 8,
  },
  {
    id: '9',
    category: 'Transport',
    question: 'Does the school provide transportation?',
    answer: 'Yes, we provide school bus service on select routes in Birgunj and surrounding areas. Please contact the school office to inquire about available routes, timings, and transportation fees.',
    order: 9,
  },
  {
    id: '10',
    category: 'General',
    question: 'What are the school timing hours?',
    answer: 'Regular school hours are from 10:00 AM to 4:00 PM, Sunday through Friday. Morning assembly begins at 9:50 AM. Students are expected to arrive at least 10 minutes before the school bell.',
    order: 10,
  },
  {
    id: '11',
    category: 'General',
    question: 'How can parents track their child\'s progress?',
    answer: 'Parents can track their child\'s progress through our ERP system (parent login). We also conduct regular Parent-Teacher Meetings (PTMs) and issue progress reports at the end of each term.',
    order: 11,
  },
  {
    id: '12',
    category: 'General',
    question: 'What is the house system?',
    answer: 'Golden Future has four houses: Red, Blue, Green, and Yellow. Students are assigned to a house upon admission. Houses compete in sports, cultural, and academic events throughout the year. Each house has a Captain and Vice Captain elected by students.',
    order: 12,
  },
];

const allCategories = ['All', 'Admissions', 'Academics', 'Fees', 'Transport', 'General'];

function FAQItem({ faq }: { faq: typeof defaultFAQs[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${open ? 'border-primary-200 shadow-sm' : 'border-secondary-100'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-secondary-50 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <HelpCircle size={18} className={`mt-0.5 shrink-0 ${open ? 'text-primary-600' : 'text-secondary-400'}`} />
          <span className={`font-semibold text-sm leading-snug ${open ? 'text-primary-700' : 'text-secondary-800'}`}>
            {faq.question}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform text-secondary-400 mt-0.5 ${open ? 'rotate-180 text-primary-600' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-secondary-600 text-sm leading-relaxed border-t border-secondary-100 pt-4 ml-6">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  useDocumentTitle('FAQ');
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: faqs = [] } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'faqs'), where('isPublished', '==', true), orderBy('order')));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });

  const displayFAQs = faqs.length > 0 ? faqs : defaultFAQs;
  const filtered = activeCategory === 'All' ? displayFAQs : displayFAQs.filter((f: any) => f.category === activeCategory);

  return (
    <div>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about admissions, academics, fees, and school life at Golden Future."
        breadcrumbs={[{ label: 'Home' }, { label: 'FAQ' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          {/* Category filter */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-2 justify-center mb-12">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-700 text-white'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-3">
            {filtered.map((faq: any, i: number) => (
              <motion.div key={faq.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <FAQItem faq={faq} />
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <HelpCircle size={48} className="text-secondary-200 mx-auto mb-4" />
              <p className="text-secondary-400">No FAQs in this category yet.</p>
            </div>
          )}

          {/* Still have questions? */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 p-8 bg-primary-900 rounded-2xl text-center text-white"
          >
            <h3 className="font-heading font-bold text-xl mb-3">Still have questions?</h3>
            <p className="text-primary-200 text-sm mb-6">Our team is happy to help. Reach out to us directly.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:051531919" className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
                <Phone size={14} /> Call 051531919
              </a>
              <a href="mailto:goldenfutureschool29@gmail.com" className="flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
                <Mail size={14} /> Send Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
