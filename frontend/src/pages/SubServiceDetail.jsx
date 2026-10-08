import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, HeartPulse, 
  Clock, Phone, MessageSquare, CheckCircle2, ListPlus, Activity, HelpCircle, ChevronDown, Star, Users, Sliders
} from 'lucide-react';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { SectionHeading } from '../components/common/Typography';
import PageLayout from '../components/common/PageLayout';
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

const SubServiceDetail = ({ services, contactSettings }) => {
  const { slug, subSlug } = useParams();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  // Derived from the URL each render so switching treatments never shows stale data
  const parentService = (Array.isArray(services) ? services : []).find(s => s.slug === slug) || null;
  const subService = parentService?.subServices?.find(
    sub => sub?.name && sub.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') === subSlug
  ) || null;

  useEffect(() => {
    if (parentService && subService) {
      document.title = `${subService.name} - ${parentService.title} - Healthcare Services`;
    }
    setActiveFaq(null);
  }, [slug, subSlug, parentService?.title, subService?.name]);

  if (!parentService || !subService) {
    return <ServiceNotFound phone={contactSettings?.phoneNumbers?.[0]} what="treatment" />;
  }

  const phone = contactSettings?.phoneNumbers?.[0] || '+91 92488 49388';
  const whatsapp = contactSettings?.whatsappNumber || '+91 92488 49388';
  const cleanPhone = String(phone || '').replace(/[^+\d]/g, '');
  const cleanWhatsapp = String(whatsapp || '').replace(/[^+\d]/g, '');

  const treatmentImage = subService.image || getSubServiceImageUrl(subService.name);

  const relatedServicesList = [
    { title: 'Doctor Consultation', desc: 'Physician tele-consults & home visits.', icon: <Users className="w-5 h-5" />, slug: 'doctor-consultation' },
    { title: 'Nursing Care', desc: '24/7 bedside nursing shifts & dressings.', icon: <HeartPulse className="w-5 h-5" />, slug: 'nursing-services' },
    { title: 'ICU Setup', desc: 'Critical care hospital ventilators at home.', icon: <Activity className="w-5 h-5" />, slug: 'icu-setup-at-home' },
    { title: 'Medical Equipment Rental', desc: 'High-quality concentrators, monitors & beds.', icon: <Sliders className="w-5 h-5" />, slug: 'icu-setup-at-home' }
  ];

  const subServiceFaqs = parentService.faqs?.slice(0, 3) || [
    { question: 'How quickly can this service be set up?', answer: 'Setup typically takes 12 to 24 hours depending on coordinator validation and physician audit checklist requirements.' },
    { question: 'Are the clinical staff background verified?', answer: 'Yes, all ICU nurses, doctors, and paramedics are background-checked and identity-verified.' },
    { question: 'Can I extend the shift length after booking?', answer: 'Absolutely. You can coordinate shift extensions directly through the dispatch dashboard or by calling the hotline.' }
  ];

  const testimonials = [
    { text: "Highly professional paramedics. The bedside ventilator setup was installed within 4 hours. Absolute lifesavers.", author: "Rajesh Kumar", rating: 5 },
    { text: "Outstanding care coordinates. The nursing staff kept detailed daily vitals logs under doctor audit.", author: "Priya Sharma", rating: 5 }
  ];

  return (
    <PageLayout
      title={subService.name}
      description={`${parentService.title} specialized treatment coordinate.`}
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: parentService.title, path: `/services/${parentService.slug}` },
        { name: subService.name }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (70%) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Clinical Treatment Overview */}
          <Card className="space-y-4">
            <h2 className="text-xs font-bold text-teal-800 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
              <Activity className="w-4 h-4 text-teal-700 animate-pulse" />
              <span>Clinical Treatment Overview</span>
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-line font-semibold">
              {subService.description || `Specialized treatment and monitoring plans for ${subService.name}. Coordinated and delivered by background-checked clinicians under senior medical supervision.`}
            </p>
          </Card>

          {/* Vetting Checklist */}
          <Card className="space-y-4">
            <h2 className="text-xs font-bold text-teal-800 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Clinical Safety Vetting Checklist</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
              {[
                'Licensed and certified clinical staff',
                'Fully sanitized and calibrated machinery',
                'Background-verified paramedic ID cards',
                'Daily senior physician audit logs',
                'Real-time telemetry coordinator backup',
                'Direct emergency ward admission linkage'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Service Specific FAQs */}
          <div className="space-y-4">
            <SectionHeading
              tag="Support FAQs"
              title="Frequently Asked Questions"
              align="left"
            />
            <div className="space-y-3">
              {subServiceFaqs.map((faq, index) => (
                <div key={index} className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm text-left">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between font-bold text-slate-800 hover:text-teal-800 transition-colors text-left"
                  >
                    <span className="text-xs uppercase tracking-wider flex items-center gap-2.5">
                      <span className="text-[9px] text-teal-600 font-bold">0{index + 1}</span>
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
                        <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-50 pt-2.5 pb-4 font-semibold">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            <SectionHeading
              tag="Patient Reviews"
              title="What Families Say"
              align="left"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testimonials.map((test, idx) => (
                <Card key={idx} className="space-y-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 italic font-semibold leading-relaxed">
                    "{test.text}"
                  </p>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    — {test.author}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Related Services */}
          <div className="space-y-4">
            <SectionHeading
              tag="Clinical Support"
              title="Related Care Specialties"
              align="left"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedServicesList.map((rs, idx) => (
                <Link
                  key={idx}
                  to={`/services/${rs.slug}`}
                  className="bg-white border border-slate-200/50 p-5 rounded-2xl flex items-center justify-between group hover:border-teal-650/40 hover:shadow-sm transition-all duration-300"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-teal-50 text-teal-800 rounded-xl group-hover:bg-teal-800 group-hover:text-white transition-colors shrink-0">
                      {rs.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-905 group-hover:text-teal-800 transition-colors uppercase tracking-wide">{rs.title}</h4>
                      <p className="text-xs text-slate-400 font-semibold line-clamp-1 mt-0.5">{rs.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-350 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT STICKY COLUMN (30%) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6 no-print">
          
          {/* Premium Image Frame */}
          <div className="rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm bg-white p-1.5">
            <div className="h-48 rounded-[20px] overflow-hidden relative">
              <img 
                src={treatmentImage} 
                alt={subService.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <Card className="space-y-5">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-widest block">Service Deployment</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                Home Diagnostics
              </div>
              <p className="text-xs text-slate-450 font-bold uppercase tracking-widest border-b border-slate-100 pb-3 mt-1.5">Includes Telemetry Audit</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/book', {
                  state: {
                    selectService: parentService.title,
                    selectSubService: subService.name
                  }
                })}
                className="w-full py-3 shadow-[0_4px_12px_rgba(13,148,136,0.12)]"
              >
                <span>Book Treatment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              <a 
                href={`https://wa.me/${cleanWhatsapp}?text=I%20want%20to%20inquire%20about%2520${encodeURIComponent(subService.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm text-center"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp Query</span>
              </a>

              <a 
                href={`tel:${cleanPhone}`}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200/60 transition-all text-center"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Call Dispatch Hotline</span>
              </a>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-3 text-xs text-slate-500">
              <h5 className="font-bold text-slate-855 uppercase text-xs tracking-wider mb-1">Triage Details</h5>
              <div className="flex justify-between text-sm">
                <span>Availability:</span>
                <span className="font-bold text-teal-800">24/7 Availability</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Response Time:</span>
                <span className="font-bold text-teal-800">Prompt Coordination</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Clinical Priority:</span>
                <span className="font-bold text-rose-500 uppercase text-xs">Emergency Linkage</span>
              </div>
            </div>
          </Card>

          {/* Quick Notice */}
          <div className="bg-teal-50/20 p-5 rounded-2xl border border-teal-100 text-xs text-slate-500 space-y-1.5">
            <div className="font-bold text-teal-800 uppercase text-xs tracking-wider">Bedside Setup Information</div>
            <p className="leading-relaxed font-semibold">
              Selecting this treatment pre-populates coordinates in the booking wizard, skipping basic details validation for speed.
            </p>
          </div>

        </div>

      </div>
    </PageLayout>
  );
};

export default SubServiceDetail;
