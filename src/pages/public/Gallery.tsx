import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Images } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { GalleryImage } from '../../types';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const defaultImages = [
  { id: '1', title: 'School Morning Assembly', imageURL: '/images/gallery/assembly.jpg', category: 'Academic', description: 'Students and staff at the morning assembly' },
  { id: '2', title: 'Our Teachers', imageURL: '/images/teachers/all_teacher.jpg', category: 'Staff', description: 'Our dedicated teaching staff' },
  { id: '3', title: 'Principal Mr. Umesh Sah', imageURL: '/images/staff/principal_Mr.Umesh_Sah.jpg', category: 'Leadership', description: 'Principal address during event' },
  { id: '4', title: 'Director Dr. Umesh Chaurasia', imageURL: '/images/staff/director_of_school_Dr.Umesh_Chaurasia.jpg', category: 'Leadership', description: 'Director at a school program' },
];

const categories = ['All', 'Events', 'Staff', 'Leadership', 'Academic', 'Sports', 'Cultural'];

export default function Gallery() {
  useDocumentTitle('Gallery');
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: images = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const snap = await getDocs(query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc')));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }) as GalleryImage);
    },
  });

  const displayImages = images.length > 0 ? images : defaultImages as unknown as GalleryImage[];
  const filtered = activeCategory === 'All' ? displayImages : displayImages.filter(img => img.category === activeCategory);

  return (
    <div>
      <PageHeader
        title="Photo Gallery"
        subtitle="Moments, memories, and milestones from Golden Future Secondary School's vibrant school life."
        breadcrumbs={[{ label: 'Home' }, { label: 'Gallery' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category filter */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 justify-center mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-700 text-white shadow-md'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Gallery grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.05 }}
                  className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer bg-secondary-100"
                  onClick={() => setSelected(img)}
                >
                  <img
                    src={img.imageURL}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                    <ZoomIn size={32} className="text-white mb-3" />
                    <p className="text-white font-semibold text-sm text-center line-clamp-2">{img.title}</p>
                    <span className="text-primary-200 text-xs mt-1">{img.category}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Images size={48} className="text-secondary-200 mx-auto mb-4" />
              <p className="text-secondary-400">No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-12 right-0 text-white hover:text-gold-300 transition-colors"
              >
                <X size={28} />
              </button>
              <img
                src={selected.imageURL}
                alt={selected.title}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
              <div className="mt-4 text-center">
                <h3 className="text-white font-semibold text-lg">{selected.title}</h3>
                {selected.description && <p className="text-white/70 text-sm mt-1">{selected.description}</p>}
                <span className="inline-block mt-2 bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">{selected.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
