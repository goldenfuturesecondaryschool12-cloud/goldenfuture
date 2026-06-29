import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mb-5">
        <Construction size={40} className="text-amber-600" />
      </div>
      <h2 className="font-heading font-bold text-2xl text-secondary-900 mb-3">{title}</h2>
      <p className="text-secondary-500 text-sm max-w-sm">
        {description || 'This section is being developed. It will be fully functional soon.'}
      </p>
    </div>
  );
}
