import { motion } from 'framer-motion';
import type { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
}

export default function StatCard({ title, value, icon: Icon, color, bgColor, change, changeType }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-secondary-100 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon size={22} className={color} />
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            changeType === 'up' ? 'bg-green-100 text-green-700' :
            changeType === 'down' ? 'bg-red-100 text-red-700' :
            'bg-secondary-100 text-secondary-600'
          }`}>
            {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {change}
          </span>
        )}
      </div>
      <div className="font-heading font-bold text-2xl text-secondary-900 mb-1">{value}</div>
      <div className="text-secondary-500 text-sm font-medium">{title}</div>
    </motion.div>
  );
}
