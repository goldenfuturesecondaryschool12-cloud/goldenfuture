import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Facebook, Youtube } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default function Contact() {
  useDocumentTitle('Contact Us');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    console.log('Contact form:', data);
    setSubmitted(true);
    setLoading(false);
    reset();
  };

  return (
    <div>
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out for admissions, inquiries, or feedback."
        breadcrumbs={[{ label: 'Home' }, { label: 'Contact' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14">
            {/* Contact Info */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="font-heading font-bold text-3xl text-secondary-900 mb-8">Get in Touch</h2>
              <div className="space-y-6 mb-10">
                {[
                  {
                    icon: MapPin,
                    title: 'Our Address',
                    content: 'Shreepur, Birgunj 44300\nProvince No. 2, Nepal',
                    color: 'bg-blue-100 text-blue-700',
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    content: '051531919',
                    href: 'tel:051531919',
                    color: 'bg-green-100 text-green-700',
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    content: 'goldenfutureschool29@gmail.com',
                    href: 'mailto:goldenfutureschool29@gmail.com',
                    color: 'bg-amber-100 text-amber-700',
                  },
                  {
                    icon: Clock,
                    title: 'Office Hours',
                    content: 'Sunday – Friday: 10:00 AM – 4:00 PM\nSaturday: Closed',
                    color: 'bg-rose-100 text-rose-700',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900 mb-1">{item.title}</div>
                      {item.href ? (
                        <a href={item.href} className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-secondary-600 text-sm whitespace-pre-line">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div>
                <div className="font-semibold text-secondary-900 mb-4">Follow Us</div>
                <div className="flex gap-3">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
                    <Facebook size={16} /> Facebook
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
                    <Youtube size={16} /> YouTube
                  </a>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-10 rounded-2xl overflow-hidden bg-secondary-100 h-60 flex items-center justify-center border border-secondary-200">
                <div className="text-center text-secondary-400">
                  <MapPin size={36} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">Shreepur, Birgunj 44300, Nepal</p>
                  <p className="text-xs">Golden Future Secondary School</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="bg-white border border-secondary-100 rounded-2xl p-8 shadow-sm">
                <h2 className="font-heading font-bold text-2xl text-secondary-900 mb-2">Send a Message</h2>
                <p className="text-secondary-500 text-sm mb-8">We'll get back to you within 1-2 business days.</p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-secondary-900 mb-2">Message Sent!</h3>
                    <p className="text-secondary-500 text-sm mb-6">Thank you for reaching out. We will respond shortly.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                          Full Name <span className="text-error-500">*</span>
                        </label>
                        <input
                          {...register('name', { required: 'Name is required' })}
                          placeholder="Your full name"
                          className="w-full border border-secondary-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                        />
                        {errors.name && <p className="text-error-600 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                          Email Address <span className="text-error-500">*</span>
                        </label>
                        <input
                          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                          type="email"
                          placeholder="your@email.com"
                          className="w-full border border-secondary-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                        />
                        {errors.email && <p className="text-error-600 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1.5">Phone Number</label>
                        <input
                          {...register('phone')}
                          placeholder="+977 98XXXXXXXX"
                          className="w-full border border-secondary-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                          Subject <span className="text-error-500">*</span>
                        </label>
                        <select
                          {...register('subject', { required: 'Subject is required' })}
                          className="w-full border border-secondary-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white"
                        >
                          <option value="">Select subject</option>
                          <option>Admission Inquiry</option>
                          <option>Fee Information</option>
                          <option>Academic Information</option>
                          <option>Transport Information</option>
                          <option>Feedback</option>
                          <option>Other</option>
                        </select>
                        {errors.subject && <p className="text-error-600 text-xs mt-1">{errors.subject.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                        Message <span className="text-error-500">*</span>
                      </label>
                      <textarea
                        {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Message must be at least 20 characters' } })}
                        rows={5}
                        placeholder="Write your message here..."
                        className="w-full border border-secondary-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all resize-none"
                      />
                      {errors.message && <p className="text-error-600 text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:bg-secondary-300 text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md text-sm"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send size={16} /> Send Message
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
