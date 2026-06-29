import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { Event } from '../../types';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const defaultEvents: Partial<Event>[] = [
  {
    id: '1',
    title: 'Annual School Assembly Day',
    description: 'A special whole-school assembly bringing together all students, teachers, and staff for a day of unity, inspiration, and celebration of our school community.',
    date: '2082-12-01',
    venue: 'School Ground, Golden Future Secondary School',
    category: 'Academic',
    organizer: 'School Administration',
    imageURL: '/images/gallery/assembly.jpg',
    isPublished: true,
  },
  {
    id: '2',
    title: 'Annual Sports Day 2083',
    description: 'Inter-house sports competition featuring athletics, football, volleyball, badminton, and other events. Come cheer for your house and witness our students\' athletic excellence.',
    date: '2083-03-15',
    venue: 'School Sports Ground',
    category: 'Sports',
    organizer: 'Physical Education Department',
    isPublished: true,
  },
  {
    id: '3',
    title: 'Science & Technology Exhibition',
    description: 'Students from Class 6 to 10 will showcase their innovative science projects. Open to parents, guests, and the public. Prizes will be awarded for the top three projects.',
    date: '2083-04-20',
    venue: 'School Hall & Science Lab',
    category: 'Academic',
    organizer: 'Science Department',
    isPublished: true,
  },
  {
    id: '4',
    title: 'Cultural Evening & Talent Show',
    description: 'An evening of cultural performances, dance, drama, and music by our talented students. A wonderful opportunity to celebrate the rich cultural heritage of Nepal.',
    date: '2083-05-10',
    venue: 'School Auditorium',
    category: 'Cultural',
    organizer: 'Cultural Committee',
    isPublished: true,
  },
  {
    id: '5',
    title: 'Parent-Teacher Meeting',
    description: 'A scheduled meeting for parents to discuss academic progress, attendance, and behavior of their children with respective class teachers and subject teachers.',
    date: '2083-02-25',
    venue: 'School Classrooms',
    category: 'Academic',
    organizer: 'School Administration',
    isPublished: true,
  },
  {
    id: '6',
    title: 'Students Council Election Day',
    description: 'The annual democratic election for the Student Council positions including Head Boy, Head Girl, House Captains, and Vice Captains.',
    date: '2083-06-01',
    venue: 'School Hall',
    category: 'Other',
    organizer: 'Election Committee',
    isPublished: true,
  },
];

const categoryConfig = {
  Academic: 'bg-blue-100 text-blue-700',
  Cultural: 'bg-purple-100 text-purple-700',
  Sports: 'bg-green-100 text-green-700',
  Religious: 'bg-amber-100 text-amber-700',
  Other: 'bg-secondary-100 text-secondary-600',
};

const allCategories = ['All', 'Academic', 'Cultural', 'Sports', 'Religious', 'Other'];

export default function EventsPage() {
  useDocumentTitle('Events');
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const snap = await getDocs(
        query(collection(db, 'events'), where('isPublished', '==', true), orderBy('date', 'asc'))
      );
      return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Event);
    },
  });

  const displayEvents = events.length > 0 ? events : (defaultEvents as Event[]);
  const filtered = activeCategory === 'All' ? displayEvents : displayEvents.filter(e => e.category === activeCategory);

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Stay updated on upcoming events, programs, and activities at Golden Future Secondary School."
        breadcrumbs={[{ label: 'Home' }, { label: 'Events' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-2 mb-12">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-700 text-white'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
              >
                <Tag size={12} /> {cat}
              </button>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((event, i) => {
              const catStyle = categoryConfig[event.category as keyof typeof categoryConfig] ?? categoryConfig.Other;
              return (
                <motion.div
                  key={event.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl border border-secondary-100 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden">
                    {event.imageURL ? (
                      <img src={event.imageURL} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar size={48} className="text-primary-200" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${catStyle}`}>{event.category}</span>
                      <span className="text-xs text-secondary-400 flex items-center gap-1">
                        <Calendar size={11} /> {event.date}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-secondary-900 text-lg mb-3 group-hover:text-primary-700 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-secondary-500 text-sm leading-relaxed line-clamp-3 mb-4">{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-secondary-500 text-xs">
                        <MapPin size={12} className="shrink-0" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary-500 text-xs">
                        <Clock size={12} className="shrink-0" />
                        <span>Organized by {event.organizer}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Calendar size={48} className="text-secondary-200 mx-auto mb-4" />
              <p className="text-secondary-400">No events in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
