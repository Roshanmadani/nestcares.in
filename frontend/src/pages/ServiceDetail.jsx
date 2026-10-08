import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { 
  CheckCircle2, ChevronLeft, ArrowRight, ShieldCheck, HeartPulse, 
  Clock, Phone, MessageSquare, ChevronDown, ListPlus, HelpCircle, FileText,
  Calendar, MapPin, ChevronRight, Activity, Sliders, Users, Star
} from 'lucide-react';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { SectionHeading } from '../components/common/Typography';
import PageLayout from '../components/common/PageLayout';
import { resolveImageUrl } from '../utils/url';
import ServiceNotFound from '../components/common/ServiceNotFound';

const getSubServiceImageUrl = (name) => {
  const n = name.toLowerCase();
  if (n.includes('wound')) {
    return 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=500';
  }
  if (n.includes('bed sore') || n.includes('sore')) {
    return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=500';
  }
  if (n.includes('elderly') || n.includes('elder')) {
    return 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=500';
  }
  if (n.includes('tracheostomy') || n.includes('post-surgery') || n.includes('nursing')) {
    return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=500';
  }
  if (n.includes('bed') || n.includes('icu setup')) {
    return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=500';
  }
  if (n.includes('monitor') || n.includes('pulse oximeter')) {
    return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=500';
  }
  if (n.includes('oxygen') || n.includes('cylinder') || n.includes('bipap') || n.includes('cpap')) {
    return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=500';
  }
  if (n.includes('ambulance')) {
    return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=500';
  }
  if (n.includes('blood') || n.includes('test') || n.includes('laboratory') || n.includes('urine')) {
    return 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=500';
  }
  if (n.includes('physiotherapy') || n.includes('rehabilitation') || n.includes('mobility')) {
    return 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=500';
  }
  if (n.includes('diet') || n.includes('dietician') || n.includes('nutrition')) {
    return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=500';
  }
  return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=500'; // Default medical
};

const DynamicIcon = ({ name, className }) => {
  const IconComponent = Icons[name] || Icons.Heart;
  return <IconComponent className={className} />;
};

const ServiceDetail = ({ services, contactSettings }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeMobileTab, setActiveMobileTab] = useState('overview');

  // Derived from the URL each render so switching between services never shows stale data
  const service = (Array.isArray(services) ? services : []).find(s => s.slug === slug) || null;

  useEffect(() => {
    if (!service) return;
    setSelectedImg(service.galleryImages?.[0] || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600');
    setActiveFaq(null);
    document.title = `${service.title} - Home Healthcare Services`;
  }, [service?._id, service?.slug]);

  if (!service) {
    return <ServiceNotFound phone={contactSettings?.phoneNumbers?.[0]} />;
  }

  const getFullImgUrl = (path) => {
    return resolveImageUrl(path || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600');
  };

  const imagesList = service.galleryImages?.length > 0 ? service.galleryImages : ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600'];

  const servicesList = Array.isArray(services) ? services : [];
  const relatedServicesList = [
    { title: 'Doctor Consultation', desc: 'Physician tele-consults & home visits.', icon: <Users className="w-5 h-5" />, slug: 'doctor-consultation' },
    { title: 'Nursing Care', desc: '24/7 bedside nursing shifts & dressings.', icon: <HeartPulse className="w-5 h-5" />, slug: 'nursing-services' },
    { title: 'ICU Setup', desc: 'Critical care hospital ventilators at home.', icon: <Activity className="w-5 h-5" />, slug: 'icu-setup-at-home' },
    { title: 'Medical Equipment Rental', desc: 'High-quality concentrators, monitors & beds.', icon: <Sliders className="w-5 h-5" />, slug: 'icu-setup-at-home' }
  ];

  const phone = contactSettings?.phoneNumbers?.[0] || '+91 92488 49388';
  const whatsapp = contactSettings?.whatsappNumber || '+91 92488 49388';
  const emergency = contactSettings?.emergencyContact || '+91 92488 49388';
  const cleanPhone = phone.replace(/[^+\d]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^+\d]/g, '');

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const mobileTabs = [
    { id: 'overview', label: 'Overview', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'faqs', label: 'FAQs', icon: <HelpCircle className="w-3.5 h-3.5" /> }
  ];

  const workflowSteps = [
    { step: '01', title: 'Consultation', desc: 'Our care coordinators check your prescriptions and requirements.' },
    { step: '02', title: 'Setup & Delivery', desc: 'We deliver sanitized medical equipment and match on-duty nurses.' },
    { step: '03', title: 'Continuous Care', desc: 'Nurses maintain logs, feeding updates, and reports for doctor review.' }
  ];

  const faqsList = service.faqs?.slice(0, 4) || [
    { question: 'What background verification is completed?', answer: 'We verify nurse registries, national identity logs, references, and complete local police credentials audits.' },
    { question: 'Can I choose between a 12-hour and 24-hour shift?', answer: 'Yes, nursing shifts can be customized to 12-hour day/night coverages or full 24-hour live-in support.' },
    { question: 'Is doctor consultation included?', answer: 'Our nurse care coordinates include weekly senior physician audits. Virtual consults are arranged on demand.' }
  ];

  const reviews = [
    { text: "The ICU setup was installed within 4 hours. Paramedics were certified and highly supportive.", author: "Rajesh K.", relation: "Son of Patient" },
    { text: "Sister Joseph managed the tracheostomy care with extreme sterile accuracy. Highly reliable service.", author: "Sunita M.", relation: "Wife of Patient" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#fdfcfb] min-h-screen text-left relative text-slate-700 font-sans pb-28 lg:pb-16 overflow-hidden"
    >
      {/* 1. COMPACT GLOSSY HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-8 no-print relative z-10">
        <div className="bg-gradient-to-tr from-slate-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden h-auto md:h-[280px] flex items-center border border-slate-800/60 shadow-xl">
          {/* Subtle grid patterns and glossy overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full relative z-10">
            {/* Left Column */}
            <div className="md:col-span-8 flex flex-col gap-4 text-left">
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-teal-200 hover:text-white transition-all uppercase tracking-wider w-fit shadow-inner backdrop-blur-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-teal-300" />
                <span>Services Catalog</span>
              </Link>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-white tracking-tight leading-tight">
                  {service.title}
                </h1>
                <p className="text-teal-100/75 text-xs mt-2.5 leading-relaxed font-semibold max-w-xl line-clamp-2">{service.shortDescription}</p>
              </div>

              {/* Service Badges */}
              <div className="flex flex-wrap gap-2 mt-1">
                {['24/7 Available', 'Certified Staff', 'Nizamabad Only', 'Home Deployment'].map((badge) => (
                  <span 
                    key={badge} 
                    className="bg-white/10 border border-white/5 backdrop-blur-sm text-teal-200 text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-md"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column Portrait Frame */}
            <div className="md:col-span-4 hidden md:flex items-center justify-end relative h-[220px]">
              <div className="relative w-80 h-[200px] rounded-3xl overflow-hidden border border-white/10 shadow-lg p-1.5 bg-white/5 backdrop-blur-md">
                <img 
                  src={getFullImgUrl(imagesList[0])} 
                  alt={service.title} 
                  className="w-full h-full object-cover rounded-[20px]"
                />
                <span className="absolute bottom-4 right-4 bg-teal-800 text-white text-[8px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                  Active Care
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Horizontal Information Bar (Responsive 2x2 on Mobile, 4x1 on Desktop) */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl lg:rounded-3xl p-3 lg:p-4 mt-[-16px] lg:mt-[-25px] relative z-20 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 shadow-[0_12px_36px_rgba(0,0,0,0.05)] max-w-6xl mx-auto no-print">
          <div className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
            <div className="p-2 bg-teal-50 text-teal-800 rounded-lg shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase tracking-wider">Response Time</span>
              <span className="text-xs lg:text-sm font-black text-slate-900 leading-tight">Prompt Callback</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
            <div className="p-2 bg-teal-50 text-teal-800 rounded-lg shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase tracking-wider">Coverage Area</span>
              <span className="text-xs lg:text-sm font-black text-slate-900 leading-tight">Nizamabad Only</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
            <div className="p-2 bg-teal-50 text-teal-800 rounded-lg shrink-0">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase tracking-wider">Category</span>
              <span className="text-xs lg:text-sm font-black text-slate-900 leading-tight">Specialized Care</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-rose-50/45 hover:bg-rose-50 rounded-xl border border-rose-100/50 transition-colors col-span-2 lg:col-span-1">
            <div className="p-2 bg-rose-100 text-rose-650 rounded-lg shrink-0">
              <Phone className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] lg:text-xs text-rose-500 font-bold uppercase tracking-wider">Emergency Hotline</span>
              <a href={`tel:${cleanPhone}`} className="text-sm font-black text-rose-800 leading-tight hover:underline inline-flex items-center min-h-10">
                {phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE INTERACTIVE TAB SWITCHER */}
      <div className="lg:hidden px-4 mb-6 no-print relative z-10">
        <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-1.5 rounded-full flex gap-1 shadow-sm overflow-x-auto scrollbar-none">
          {mobileTabs.map((tab) => {
            const isActive = activeMobileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMobileTab(tab.id)}
                className={`relative flex-1 py-2 px-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer select-none outline-none shrink-0 ${
                  isActive ? 'text-teal-800 font-extrabold' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileTabBackground"
                    className="absolute inset-0 bg-white border border-teal-850/10 rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  {tab.icon}
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 70/30 GRID CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 70% COLUMN */}
          <div className={`lg:col-span-8 space-y-8 ${activeMobileTab !== 'overview' ? 'hidden lg:block' : ''}`}>
            
            {/* About Service Description */}
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-teal-800 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-teal-700" />
                <span>About Service Speciality</span>
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                {service.description || 'Professional home healthcare services, designed to deliver high-quality clinical setups directly at bedside. Our verified nursing staff works with visiting specialists to monitor vital signs, administer drugs, and manage post-surgery recovery coordinates.'}
              </p>
            </Card>

            {/* How it Works Timeline */}
            <div className={`space-y-4 ${activeMobileTab !== 'timeline' ? 'hidden lg:block' : ''}`}>
              <SectionHeading
                tag="Onboarding"
                title="Service Installation Steps"
                align="left"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {workflowSteps.map((ws, idx) => (
                  <Card key={idx} className="flex flex-col gap-2.5 text-left relative rounded-2xl border border-slate-150">
                    <div className="w-7 h-7 bg-teal-50 border border-teal-200/50 text-teal-800 rounded-full flex items-center justify-center text-xs font-bold">
                      {ws.step}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mt-1">{ws.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{ws.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Speciality FAQs */}
            <div className={`space-y-4 ${activeMobileTab !== 'faqs' ? 'hidden lg:block' : ''}`}>
              <SectionHeading
                tag="FAQs"
                title="Treatment Coordination FAQs"
                align="left"
              />
              <div className="space-y-3">
                {faqsList.map((faq, index) => (
                  <div key={index} className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm text-left">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-5 py-4 flex items-center justify-between font-bold text-slate-800 hover:text-teal-800 transition-colors text-left"
                    >
                      <span className="text-sm uppercase tracking-wider flex items-center gap-2.5">
                        <span className="text-xs text-teal-600 font-bold">0{index + 1}</span>
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {activeFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="px-5 overflow-hidden"
                        >
                          <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-2.5 pb-4 font-semibold">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4 pt-2">
              <SectionHeading
                tag="Patient Reviews"
                title="What Families Say"
                align="left"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((rev, idx) => (
                  <Card key={idx} className="space-y-3 text-left">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-500 italic font-semibold leading-relaxed">
                      "{rev.text}"
                    </p>
                    <div className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                      — {rev.author} ({rev.relation})
                    </div>
                  </Card>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 30% STICKY COLUMN (Booking Card) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6 no-print">
            
            {/* Sticky Booking Selector Card */}
            <Card className="space-y-5">
              <div>
                <span className="text-xs font-bold text-teal-800 uppercase tracking-widest block">Deployment Status</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  Active Booking
                </div>
                <p className="text-xs text-slate-450 font-bold uppercase tracking-widest border-b border-slate-100 pb-3 mt-1.5">Vitals Log Setup Included</p>
              </div>

              <div className="flex flex-col gap-2.5">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/book', { state: { selectService: service.title } })}
                  className="w-full py-3"
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>

                <a 
                  href={`https://wa.me/${cleanWhatsapp}?text=I%20want%20to%20inquire%20about%20${encodeURIComponent(service.title)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Chat</span>
                </a>

                <a 
                  href={`tel:${cleanPhone}`}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200/60 transition-all text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call Hotline</span>
                </a>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3 text-xs text-slate-500">
                <h5 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-1">Service Specifications</h5>
                <div className="flex justify-between">
                  <span>Shift Coverages:</span>
                  <span className="font-semibold text-slate-700">12h / 24h bed shifts</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Frequency:</span>
                  <span className="font-semibold text-slate-700">Weekly Consultant check</span>
                </div>
                <div className="flex justify-between">
                  <span>Triage Response:</span>
                  <span className="font-bold text-red-650 flex items-center gap-1">
                    <span>15 Min Callback</span>
                  </span>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </div>

      {/* SECTION 3 — Available Sub-Services/Packages (Light Snapping Slider) */}
      {service.subServices?.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-y border-slate-150/40 relative z-10 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <div className="max-w-2xl mx-auto mb-8 lg:mb-12 flex flex-col gap-2">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">Available Options</span>
              <h3 className="text-xl sm:text-2xl font-serif-editorial font-bold text-slate-950 leading-tight">Sub-Services & Machinery</h3>
              <p className="text-slate-500 text-xs font-medium">Select a specialized treatment coordinate or medical machinery setup package.</p>
            </div>

            {/* Swipe Slider on Mobile, Grid on Desktop */}
            <div 
              className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory pb-6 px-4 -mx-4 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {(service.subServices || []).filter(sub => sub && sub.active).map((sub, idx) => {
                const cardImage = sub.image || getSubServiceImageUrl(sub.name);
                const subSlug = sub.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                
                return (
                  <Card 
                    key={idx}
                    className="flex flex-col h-full !p-0 overflow-hidden text-left shrink-0 w-[82vw] sm:w-[350px] lg:w-auto snap-center relative"
                  >
                    {/* Image */}
                    <Link 
                      to={`/services/${service.slug}/${subSlug}`}
                      className="h-44 lg:h-48 overflow-hidden relative block"
                    >
                      <img 
                        src={cardImage} 
                        alt={sub.name} 
                        className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex flex-col grow justify-between">
                      <div className="space-y-2">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">{service.title}</span>
                        <Link 
                          to={`/services/${service.slug}/${subSlug}`}
                          className="hover:text-teal-800 transition-colors block"
                        >
                          <h4 className="text-sm lg:text-base font-bold text-slate-950 uppercase leading-tight">{sub.name}</h4>
                        </Link>
                        {sub.description && (
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 font-semibold">{sub.description}</p>
                        )}
                                             {/* Included Features */}
                        <div className="pt-3 space-y-2 border-t border-slate-100">
                          <div className="flex items-start gap-2 text-slate-500 text-[10px] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                            <span>Clinical Coordination Backup</span>
                          </div>
                          <div className="flex items-start gap-2 text-slate-500 text-[10px] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                            <span>On-duty Telemetry Supervision</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Row */}
                      <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                          Available at Bedside
                        </span>
                        
                        <Link 
                          to={`/services/${service.slug}/${subSlug}`}
                          className="bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-extrabold uppercase min-h-10 inline-flex items-center px-5 rounded-full transition-all duration-300 shadow-sm hover:shadow active:scale-98 cursor-pointer text-center"
                        >
                          View Info
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* SECTION 6 — Related Services */}
      <section className="py-12 lg:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto mb-8 lg:mb-12 flex flex-col gap-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">Medical Support</span>
            <h3 className="text-xl sm:text-2xl font-serif-editorial font-bold text-slate-950 uppercase tracking-wider">Related Services</h3>
            <p className="text-slate-500 text-xs font-medium">Explore alternative care specialties and deployment modules.</p>
          </div>

          <div 
            className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory pb-6 px-4 -mx-4 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {relatedServicesList.map((rs, idx) => (
              <Link
                key={idx}
                to={`/services/${rs.slug}`}
                className="bg-white border border-slate-200/50 hover:border-teal-700/30 p-5 lg:p-6 rounded-3xl flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300 shrink-0 w-[72vw] sm:w-[280px] lg:w-auto snap-center"
              >
                <div className="space-y-3.5 text-left">
                  <div className="p-3 bg-teal-50 text-teal-800 rounded-xl w-fit group-hover:bg-teal-800 group-hover:text-white transition-all">
                    {rs.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wide group-hover:text-teal-855 transition-colors">{rs.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-semibold line-clamp-2">{rs.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-teal-800 mt-5 group-hover:underline text-left">
                  <span>Explore Speciality</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* BOTTOM CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 no-print relative z-10 mb-8">
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-6 lg:p-12 relative overflow-hidden shadow-md text-center">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>
          
          <div className="relative z-10 flex flex-col gap-4 max-w-xl mx-auto">
            <h3 className="text-lg sm:text-2xl font-serif-editorial font-bold tracking-tight text-white">Need immediate medical assistance?</h3>
            <p className="text-slate-200 text-xs leading-relaxed font-semibold">
              Contact us today to receive a customized patient recovery plan. We arrange medical equipment delivery, nurse schedules, and physician visits within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 lg:mt-3 w-full">
              <button
                onClick={() => navigate('/book', { state: { selectService: service.title } })}
                className="w-full sm:w-auto px-7 py-3 bg-teal-400 hover:bg-teal-350 text-slate-950 text-xs font-extrabold rounded-xl text-center transition-all duration-300 shadow-[0_4px_15px_rgba(45,212,191,0.25)] hover:shadow-[0_6px_20px_rgba(45,212,191,0.35)] active:scale-98 cursor-pointer"
              >
                Book Appointment
              </button>
              <a 
                href={`tel:${cleanPhone}`} 
                className="w-full sm:w-auto px-7 py-3 bg-white text-slate-900 hover:bg-slate-50 text-xs font-extrabold rounded-xl text-center transition-all duration-300 shadow-md active:scale-98 cursor-pointer"
              >
                <span>Call Hotline</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM MOBILE CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 flex items-center justify-between shadow-lg lg:hidden no-print animate-slide-up">
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Availability</span>
          <span className="text-sm font-extrabold text-slate-950 leading-tight">
            24/7 Coverage
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href={`tel:${cleanPhone}`}
            className="p-3 border border-slate-200 text-slate-700 rounded-full hover:bg-slate-50 transition-all flex items-center justify-center bg-white"
          >
            <Phone className="w-4 h-4 text-teal-800" />
          </a>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/book', { state: { selectService: service.title } })}
            className="!px-5 !py-2.5"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

    </motion.div>
  );
};

export default ServiceDetail;
