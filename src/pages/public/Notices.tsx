import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, AlertTriangle, Info, BookOpen, Megaphone, FileText, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { Notice } from '../../types';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const categoryConfig = {
  General: { icon: Info, color: 'bg-blue-100 text-blue-700 border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  Academic: { icon: BookOpen, color: 'bg-green-100 text-green-700 border-green-200', badge: 'bg-green-100 text-green-700' },
  Exam: { icon: FileText, color: 'bg-amber-100 text-amber-700 border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  Event: { icon: Calendar, color: 'bg-purple-100 text-purple-700 border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  Holiday: { icon: Bell, color: 'bg-rose-100 text-rose-700 border-rose-200', badge: 'bg-rose-100 text-rose-700' },
  Urgent: { icon: AlertTriangle, color: 'bg-red-100 text-red-700 border-red-200', badge: 'bg-red-100 text-red-700' },
};

const defaultNotices: Partial<Notice>[] = [
  {
    id: '1',
    title: 'Academic Calendar 2082-2083 B.S. Released',
    content: 'The academic calendar for the year 2082-2083 B.S. has been finalized and is now available for download. Parents and students are requested to note all important dates including examinations, holidays, and events.',
    category: 'Academic',
    isActive: true,
    publishedAt: new Date(),
  },
  {
    id: '2',
    title: 'Final Examination Schedule – Class 9 & 10',
    content: 'The final examination schedule for Class 9 and Class 10 for the academic year 2082-2083 is hereby announced. All students are required to appear in all examinations as scheduled. Admit cards will be distributed one week before the examination.',
    category: 'Exam',
    isActive: true,
    publishedAt: new Date(),
  },
  {
    id: '3',
    title: 'Annual Sports Day – Registration Open',
    content: 'Registration for the Annual Sports Day 2083 is now open. Students interested in participating in various sports events including track & field, volleyball, football, and badminton must register with their class teacher by Ashad 15, 2083.',
    category: 'Event',
    isActive: true,
    publishedAt: new Date(),
  },
  {
    id: '4',
    title: 'Urgent: Fee Payment Deadline Extended',
    content: 'The fee payment deadline for the current trimester has been extended by 15 days due to banking holidays. All students must ensure fee payment is completed before the new deadline. Late fee will be charged after the deadline.',
    category: 'Urgent',
    isActive: true,
    publishedAt: new Date(),
  },
  {
    id: '5',
    title: 'Public Holiday – Dashain & Tihar Vacation',
    content: 'The school will remain closed from Ashwin 30 to Kartik 12, 2083 for Dashain and Tihar festivals. Classes will resume on Kartik 13, 2083. We wish all students, parents, and staff a joyful festival season.',
    category: 'Holiday',
    isActive: true,
    publishedAt: new Date(),
  },
  {
    id: '6',
    title: 'Parent-Teacher Meeting – Shrawan 25, 2083',
    content: 'A Parent-Teacher Meeting (PTM) is scheduled for Shrawan 25, 2083 from 10:00 AM to 2:00 PM. All parents are cordially invited to discuss their child\'s academic progress and address any concerns with teachers.',
    category: 'General',
    isActive: true,
    publishedAt: new Date(),
  },
];

const categories = ['All', 'General', 'Academic', 'Exam', 'Event', 'Holiday', 'Urgent'];

export default function NoticesPage() {
  useDocumentTitle('Notices');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: notices = [] } = useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      const snap = await getDocs(
        query(collection(db, 'notices'), where('isActive', '==', true), orderBy('publishedAt', 'desc'))
      );
      return snap.docs.map(d => ({ id: d.id, ...d.data(), publishedAt: d.data().publishedAt?.toDate() }) as Notice);
    },
  });

  const displayNotices = notices.length > 0 ? notices : (defaultNotices as Notice[]);
  const filtered = activeCategory === 'All' ? displayNotices : displayNotices.filter(n => n.category === activeCategory);

  return (
    <div>
      <PageHeader
        title="Notices"
        subtitle="Official notices, announcements, and important information from Golden Future Secondary School administration."
        breadcrumbs={[{ label: 'Home' }, { label: 'Notices' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Category Filter */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
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

          {/* Notices list */}
          <div className="space-y-4">
            {filtered.map((notice, i) => {
              const config = categoryConfig[notice.category as keyof typeof categoryConfig] ?? categoryConfig.General;
              const Icon = config.icon;
              const isExpanded = expandedId === notice.id;
              return (
                <motion.div
                  key={notice.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`border-2 rounded-2xl overflow-hidden ${config.color}`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/50`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/60`}>
                              {notice.category}
                            </span>
                            {notice.category === 'Urgent' && (
                              <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full animate-pulse">
                                URGENT
                              </span>
                            )}
                          </div>
                          <h3 className="font-heading font-bold text-lg leading-snug mb-2">{notice.title}</h3>
                          <p className={`text-sm leading-relaxed opacity-80 ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {notice.content}
                          </p>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                            className="mt-2 text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity"
                          >
                            {isExpanded ? 'Show less ▲' : 'Read full notice ▼'}
                          </button>
                          {notice.attachments && notice.attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {notice.attachments.map((att, j) => (
                                <a
                                  key={j}
                                  href={att}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-xs font-medium bg-white/60 px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
                                >
                                  <Download size={12} /> Attachment {j + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-xs opacity-60 whitespace-nowrap">
                          <Calendar size={11} />
                          {notice.publishedAt ? new Intl.DateTimeFormat('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(notice.publishedAt)) : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Megaphone size={48} className="text-secondary-200 mx-auto mb-4" />
              <p className="text-secondary-400">No notices in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
