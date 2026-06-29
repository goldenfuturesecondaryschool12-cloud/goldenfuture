import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, File, BookOpen, Bell, FolderOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { Download as DownloadType } from '../../types';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const categoryConfig = {
  Form: { icon: FileText, color: 'bg-blue-100 text-blue-700' },
  Syllabus: { icon: BookOpen, color: 'bg-green-100 text-green-700' },
  Result: { icon: File, color: 'bg-amber-100 text-amber-700' },
  Notice: { icon: Bell, color: 'bg-rose-100 text-rose-700' },
  Other: { icon: FolderOpen, color: 'bg-secondary-100 text-secondary-700' },
};

const defaultDownloads: Partial<DownloadType>[] = [
  { id: '1', title: 'Admission Form 2083-2084 B.S.', description: 'Official admission application form for new students', category: 'Form', fileName: 'Admission_Form_2083.pdf', fileSize: '245 KB' },
  { id: '2', title: 'Class 10 Syllabus 2082-2083', description: 'Complete SEE syllabus for all subjects', category: 'Syllabus', fileName: 'Class10_Syllabus_2082.pdf', fileSize: '1.2 MB' },
  { id: '3', title: 'Class 9 Syllabus 2082-2083', description: 'Complete syllabus for Class 9', category: 'Syllabus', fileName: 'Class9_Syllabus_2082.pdf', fileSize: '1.1 MB' },
  { id: '4', title: 'Academic Calendar 2083 B.S.', description: 'Full academic calendar with holidays and events', category: 'Notice', fileName: 'Academic_Calendar_2083.pdf', fileSize: '380 KB' },
  { id: '5', title: 'Leave Application Form', description: 'Application form for student leave of absence', category: 'Form', fileName: 'Leave_Application.pdf', fileSize: '120 KB' },
  { id: '6', title: 'Transfer Certificate Request Form', description: 'Form for requesting Transfer Certificate (TC)', category: 'Form', fileName: 'TC_Request_Form.pdf', fileSize: '115 KB' },
  { id: '7', title: 'Mid-Term Result 2082 – Class 7 & 8', description: 'Mid-term examination results for Class 7 and 8', category: 'Result', fileName: 'MidTerm_Result_7_8.pdf', fileSize: '520 KB' },
  { id: '8', title: 'School Fee Structure 2083 B.S.', description: 'Complete fee structure for all classes', category: 'Notice', fileName: 'Fee_Structure_2083.pdf', fileSize: '200 KB' },
];

const allCategories = ['All', 'Form', 'Syllabus', 'Result', 'Notice', 'Other'];

export default function Downloads() {
  useDocumentTitle('Downloads');
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: downloads = [] } = useQuery({
    queryKey: ['downloads'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'downloads'), orderBy('uploadedAt', 'desc')));
      return snap.docs.map(d => ({ id: d.id, ...d.data(), uploadedAt: d.data().uploadedAt?.toDate() }) as DownloadType);
    },
  });

  const displayDownloads = downloads.length > 0 ? downloads : (defaultDownloads as DownloadType[]);
  const filtered = activeCategory === 'All' ? displayDownloads : displayDownloads.filter(d => d.category === activeCategory);

  return (
    <div>
      <PageHeader
        title="Downloads"
        subtitle="Download official forms, syllabi, results, notices, and other important documents from Golden Future Secondary School."
        breadcrumbs={[{ label: 'Home' }, { label: 'Downloads' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          {/* Category filter */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-2 mb-12">
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

          {/* Downloads list */}
          <div className="space-y-3">
            {filtered.map((item, i) => {
              const config = categoryConfig[item.category as keyof typeof categoryConfig] ?? categoryConfig.Other;
              const Icon = config.icon;
              return (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-secondary-100 hover:border-primary-200 hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-secondary-900 text-sm">{item.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}>
                        {item.category}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-secondary-500 text-xs">{item.description}</p>
                    )}
                    {item.fileSize && (
                      <p className="text-secondary-400 text-xs mt-0.5">{item.fileName} · {item.fileSize}</p>
                    )}
                  </div>
                  {item.fileURL ? (
                    <a
                      href={item.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 shadow-sm group-hover:shadow-md"
                    >
                      <Download size={14} /> Download
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 bg-secondary-100 text-secondary-400 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 cursor-not-allowed">
                      <Download size={14} /> Coming Soon
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <FolderOpen size={48} className="text-secondary-200 mx-auto mb-4" />
              <p className="text-secondary-400">No files in this category yet.</p>
            </div>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 p-6 bg-primary-50 border border-primary-100 rounded-2xl"
          >
            <p className="text-primary-800 text-sm font-medium">
              Can't find what you're looking for? Contact the school office at{' '}
              <a href="tel:051531919" className="underline">051531919</a> or email{' '}
              <a href="mailto:goldenfutureschool29@gmail.com" className="underline">goldenfutureschool29@gmail.com</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
