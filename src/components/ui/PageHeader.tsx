import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; to?: string }[];
  bgImage?: string;
}

export default function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16 md:py-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 text-center">
        {breadcrumbs && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-sm text-primary-200 mb-4"
          >
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumbs.length - 1 ? 'text-gold-300 font-medium' : ''}>{b.label}</span>
              </span>
            ))}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading font-bold text-4xl md:text-5xl text-white mb-4"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-200 text-lg max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
