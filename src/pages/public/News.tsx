import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, Tag, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { News } from '../../types';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const defaultNews: Partial<News>[] = [
  {
    id: '1',
    title: 'Morning Assembly – A Daily Tradition of Unity at Golden Future',
    excerpt: 'The morning assembly at Golden Future Secondary School brings together students and teachers every day. It sets the tone for learning with prayers, announcements, and words of inspiration.',
    content: '',
    publishedAt: new Date('2082-09-01'),
    imageURL: '/images/gallery/assembly.jpg',
    tags: ['Academic', 'Events'],
    isPublished: true,
  },
  {
    id: '2',
    title: 'Continuous Assessment System (CAS) Implementation – Enhancing Assessment Practices',
    excerpt: 'Golden Future Secondary School successfully implemented the Continuous Assessment System (CAS) to enhance assessment practices for quality education, with teachers receiving specialized training.',
    content: '',
    publishedAt: new Date('2082-08-15'),
    tags: ['Academic', 'Assessment'],
    isPublished: true,
  },
  {
    id: '3',
    title: 'Annual Sports Day 2082 – Students Shine in Athletics',
    excerpt: 'Students from all four houses competed with great spirit in our annual sports day. The event featured track events, team sports, and inter-house competitions with awards for winners.',
    content: '',
    publishedAt: new Date('2082-06-20'),
    tags: ['Sports', 'Events'],
    isPublished: true,
  },
  {
    id: '4',
    title: 'Science Exhibition 2082 – Young Innovators on Display',
    excerpt: 'Our annual science exhibition showcased brilliant student projects ranging from environmental solutions to technological innovations. Parents and guests were impressed by the creativity and depth of knowledge displayed.',
    content: '',
    publishedAt: new Date('2082-04-10'),
    tags: ['Academic', 'Science'],
    isPublished: true,
  },
];

const allTags = ['All', 'Events', 'Academic', 'Sports', 'Cultural', 'Achievement'];

export default function NewsPage() {
  useDocumentTitle('News');
  const [activeTag, setActiveTag] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: newsItems = [] } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const snap = await getDocs(
        query(collection(db, 'news'), where('isPublished', '==', true), orderBy('publishedAt', 'desc'))
      );
      return snap.docs.map(d => ({ id: d.id, ...d.data(), publishedAt: d.data().publishedAt?.toDate() }) as News);
    },
  });

  const displayNews = newsItems.length > 0 ? newsItems : (defaultNews as News[]);
  const filtered = activeTag === 'All' ? displayNews : displayNews.filter(n => n.tags?.includes(activeTag));

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return new Intl.DateTimeFormat('en-NP', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
  };

  return (
    <div>
      <PageHeader
        title="News & Updates"
        subtitle="Stay informed about the latest happenings, achievements, and stories from Golden Future Secondary School."
        breadcrumbs={[{ label: 'Home' }, { label: 'News' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tag filter */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-2 mb-12">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTag === tag
                    ? 'bg-primary-700 text-white'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
              >
                <Tag size={12} /> {tag}
              </button>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((news, i) => (
              <motion.article
                key={news.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-secondary-100 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-52 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50">
                  {news.imageURL ? (
                    <img src={news.imageURL} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={48} className="text-primary-200" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-secondary-400 text-xs">
                      <Calendar size={12} />
                      {formatDate(news.publishedAt)}
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {news.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h2 className="font-heading font-bold text-secondary-900 text-lg mb-3 leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">
                    {news.title}
                  </h2>
                  <p className={`text-secondary-500 text-sm leading-relaxed ${expandedId === news.id ? '' : 'line-clamp-3'}`}>
                    {news.excerpt}
                  </p>
                  {news.excerpt.length > 150 && (
                    <button
                      onClick={() => setExpandedId(expandedId === news.id ? null : news.id)}
                      className="mt-3 flex items-center gap-1 text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
                    >
                      {expandedId === news.id ? 'Read less' : 'Read more'}
                      <ChevronRight size={14} className={`transition-transform ${expandedId === news.id ? 'rotate-90' : ''}`} />
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-secondary-200 mx-auto mb-4" />
              <p className="text-secondary-400">No news in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
