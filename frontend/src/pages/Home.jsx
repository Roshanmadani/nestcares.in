import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, MotionConfig, animate, useInView, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck, HeartPulse, Clock,
  ArrowRight, CheckCircle2, Star, Activity, Stethoscope,
  Truck, Microscope, UserCheck, MessageSquare,
  MapPin, PhoneCall, ArrowUpRight, Plus
} from 'lucide-react';
import { resolveImageUrl } from '../utils/url';

const LUXURY_SERVICES = [
  {
    id: 'doctor-consultation',
    title: 'Doctor Consultation',
    desc: 'Senior MBBS / MD physicians visit your home in Nizamabad for physical examination, diagnostics, and prescriptions.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=700',
    badge: 'Home Visit',
    icon: Stethoscope,
    tags: ['General Medicine', 'Specialist Visits', 'Bedside Care']
  },
  {
    id: 'ambulance-services',
    title: '24/7 Ambulance Dispatch',
    desc: 'Rapid Basic Life Support (BLS) and Advanced ICU Ventilator ambulances with emergency paramedics on standby.',
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=700',
    badge: '15-Min Response',
    emergency: true,
    icon: Truck,
    tags: ['Oxygen Support', 'ICU Ventilator', 'Inter-City Transfer']
  },
  {
    id: 'nursing-services',
    title: 'Professional Home Nursing',
    desc: 'Certified ICU and general bedside nurses for 12h / 24h continuous clinical care, wound dressing, and vitals monitoring.',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=700',
    badge: '12h / 24h Shifts',
    icon: HeartPulse,
    tags: ['Bedside Care', 'Tracheostomy', 'Injections & IV']
  },
  {
    id: 'icu-setup',
    title: 'ICU Setup at Home',
    desc: 'Complete hospital-grade intensive care unit in your bedroom: motorized ICU bed, ventilator, 5-para monitor, and oxygen.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=700',
    badge: 'Hospital-Grade',
    icon: Activity,
    tags: ['Motorized ICU Bed', 'BiPAP / CPAP', 'Multipara Monitor']
  },
  {
    id: 'lab-services',
    title: 'Doorstep Lab Diagnostics',
    desc: 'Certified phlebotomists collect blood & urine samples at your home. NABL certified test reports delivered in 4-6 hours.',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=700',
    badge: 'Doorstep Sample',
    icon: Microscope,
    tags: ['Complete Health Panel', 'Cardiac Profile', 'Fast Reports']
  },
  {
    id: 'physiotherapy',
    title: 'Home Physiotherapy',
    desc: 'Licensed physiotherapists for post-surgery joint rehabilitation, neuro-recovery, stroke rehab, and geriatric mobility.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=700',
    badge: 'Mobility Rehab',
    icon: UserCheck,
    tags: ['Stroke Recovery', 'Joint Mobility', 'Pain Relief']
  }
];

const LUXURY_PILLARS = [
  {
    title: 'Zero Advance Required',
    desc: 'Pay transparently only after medical setup or bedside care is delivered.',
    icon: CheckCircle2
  },
  {
    title: '100% Certified Clinicians',
    desc: 'All doctors, nurses, and technicians hold active state medical council registrations.',
    icon: ShieldCheck
  },
  {
    title: 'Hospital-Grade Equipment',
    desc: 'Calibrated ventilators, multipara monitors, and sanitized ICU motorized beds.',
    icon: Activity
  },
  {
    title: '15-Minute Response',
    desc: 'Dedicated emergency medical coordinator desk in Nizamabad for rapid triage.',
    icon: Clock
  }
];

const LUXURY_FAQS = [
  {
    q: 'How quickly can a doctor or ambulance arrive at our home in Nizamabad?',
    a: 'For emergency ambulance dispatch, our vehicles arrive within 15-30 minutes across Nizamabad municipal limits. Scheduled doctor home visits and nursing shifts are arranged for your preferred time slot.'
  },
  {
    q: 'Do I need to pay any advance fee before service starts?',
    a: 'No. Zero advance payment is required for initial coordinator triage or scheduling. Payment is collected transparently only after clinicians or medical equipment arrive at your home.'
  },
  {
    q: 'What medical equipment is included in a complete Home ICU Setup?',
    a: 'A complete home ICU setup includes a motorized ICU bed with remote adjustments, critical care ventilator (BiPAP/CPAP/Invasive), 5-para vital signs monitor, suction machine, continuous oxygen concentrator, and a 24/7 ICU-trained bedside nurse.'
  },
  {
    q: 'Are all nurses and clinicians certified in Telangana?',
    a: 'Yes. 100% of our doctors, nurses, and phlebotomists hold valid state registrations (TSMC / Telangana Nursing Council) and undergo thorough clinical verification.'
  }
];

const LOCALITIES = [
  { name: 'Kanteshwar', tag: 'Fast Dispatch' },
  { name: 'Subhash Nagar', tag: '24/7 Nursing' },
  { name: 'Pragathi Nagar', tag: 'Home Visits' },
  { name: 'Vinayak Nagar', tag: 'ICU Care' },
  { name: 'Khaleelwadi', tag: 'Lab Tests' },
  { name: 'Mubaraknagar', tag: 'Care Takers' },
  { name: 'Madhavnagar', tag: 'Physiotherapy' },
  { name: 'Shivaji Nagar', tag: 'Elder Care' },
  { name: 'Armoor Hub', tag: 'Doctor Visits' },
  { name: 'Bodhan City', tag: 'ICU Setup' },
  { name: 'Kamareddy', tag: 'Ambulance' },
  { name: 'Banswada', tag: 'Medical Eqpt' }
];

const SEO_KEYWORDS = [
  '#1 Home Nursing Care',
  'Home ICU Setup',
  'Doctor Consultation at Home',
  'Elderly & Bedridden Care',
  'Physiotherapy',
  'Oxygen Concentrator Rental'
];

const FALLBACK_DOCTORS = [
  {
    _id: 'doc_1',
    name: 'Dr. K. Srinivas Reddy',
    specialty: 'Senior General Physician & Geriatrician',
    qualifications: 'MBBS, MD (General Medicine)',
    experience: '14+ Years Exp',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    availability: 'Mon - Sat (9:00 AM - 7:00 PM)'
  },
  {
    _id: 'doc_2',
    name: 'Dr. Ananya Sharma',
    specialty: 'Critical Care & ICU Consultant',
    qualifications: 'MBBS, DA, DNB (Critical Care)',
    experience: '10+ Years Exp',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    availability: '24/7 Standby on Request'
  },
  {
    _id: 'doc_3',
    name: 'Dr. M. Venkat Rao',
    specialty: 'Consultant Cardiologist & Physician',
    qualifications: 'MBBS, MD, DM (Cardiology)',
    experience: '16+ Years Exp',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    availability: 'Mon, Wed, Fri (2:00 PM - 6:00 PM)'
  }
];

const EASE_OUT = [0.16, 1, 0.3, 1];

// Fades a block up as it scrolls into view. MotionConfig below drops the
// movement for users with reduced-motion enabled.
const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.7, ease: EASE_OUT, delay }}
  >
    {children}
  </motion.div>
);

// Headline words rise in one after another
const AnimatedWords = ({ text, delay = 0, className = '', style }) => (
  <span className={className} style={style}>
    {text.split(' ').map((word, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
        <motion.span
          className="inline-block"
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: delay + i * 0.07 }}
        >
          {word}{' '}
        </motion.span>
      </span>
    ))}
  </span>
);

// Counts from 0 to `to` the first time it scrolls into view
const CountUp = ({ to, suffix = '', duration = 1.6 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return <span ref={ref} className="tabular-nums">{value}{suffix}</span>;
};

// Stagger for card rails: the rail triggers once, cards cascade in
const RAIL_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE_OUT } },
};

const Eyebrow = ({ children, tone = 'light' }) => (
  <div className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] ${tone === 'dark' ? 'text-emerald-300' : 'text-slate-500'}`}>
    <span className={`h-px w-6 ${tone === 'dark' ? 'bg-emerald-300/60' : 'bg-slate-400/70'}`} />
    {children}
  </div>
);

const SectionHeader = ({ eyebrow, title, desc, link }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7 sm:mb-10">
    <div className="space-y-3 max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-[1.75rem] leading-[1.1] sm:text-4xl lg:text-[2.75rem] font-black text-slate-950 tracking-[-0.03em]">
        {title}
      </h2>
      {desc && (
        <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed max-w-xl">{desc}</p>
      )}
    </div>
    {link && (
      <Link
        to={link.to}
        className="liquid-glass self-start md:self-auto inline-flex items-center gap-1.5 pl-4 pr-3 py-2.5 rounded-full text-[13px] font-bold text-slate-900 hover:-translate-y-0.5 transition-transform shrink-0"
      >
        <span>{link.label}</span>
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    )}
  </div>
);

// Horizontal snap rail on phones, grid from md up. Reports scroll progress so
// the rail can show where the user is.
const SnapRail = ({ children, className = '' }) => {
  const railRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <>
      <motion.div
        ref={railRef}
        onScroll={handleScroll}
        variants={RAIL_VARIANTS}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className={`flex md:grid gap-4 sm:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-4 -mx-4 px-4 md:mx-0 md:px-0 pt-1 pb-3 scrollbar-none ${className}`}
      >
        {children}
      </motion.div>
      <div className="md:hidden mt-4 mx-auto h-1 w-24 rounded-full bg-slate-900/10 overflow-hidden" aria-hidden="true">
        <div
          className="h-full w-1/3 rounded-full bg-slate-900 transition-transform duration-150"
          style={{ transform: `translateX(${progress * 200}%)` }}
        />
      </div>
    </>
  );
};

const Home = ({
  faqs = [],
  doctors = [],
  contactSettings
}) => {
  const navigate = useNavigate();
  const phone = contactSettings?.phoneNumbers?.[0] || "+91 92488 49388";
  const whatsapp = contactSettings?.whatsappNumber || "+91 92488 49388";
  const cleanPhone = phone.replace(/\s+/g, '');
  const cleanWhatsapp = whatsapp.replace(/\D/g, '');

  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const displayFaqs = (faqs && faqs.length > 0) ? faqs : LUXURY_FAQS;

  // Backend doctors use image/specialty/qualifications; the local mock cache
  // uses img/speciality/designation. Normalise so either shape renders.
  const displayDoctors = ((doctors && doctors.length > 0)
    ? doctors.filter(d => d.isActive !== false && d.active !== false)
    : FALLBACK_DOCTORS
  ).map(d => ({
    ...d,
    image: d.image || d.img,
    specialty: d.specialty || d.speciality || d.designation,
    qualifications: d.qualifications || d.designation || 'MBBS',
    availability: d.availability || 'Available for Home Visits'
  }));

  const handleBookService = (serviceTitle) => {
    navigate('/book', { state: { selectService: serviceTitle } });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen text-slate-800 font-sans relative pb-10 sm:pb-16 overflow-x-clip">

        {/* ========================================================
            1. HERO (with horizon glow)
        ======================================================== */}
        <section className="relative overflow-hidden -mt-20 sm:-mt-24 pt-20 sm:pt-24">
          <motion.div
            aria-hidden="true"
            className="horizon"
            style={{ '--horizon-rise': '120px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.3 }}
          />
          <div className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-10 lg:pt-14 pb-[130px] sm:pb-[180px]">
          <div className="max-w-4xl">

            <div className="text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="liquid-glass inline-flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold text-slate-700"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="anim-live-pulse absolute inset-0 rounded-full bg-emerald-500" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span><span className="font-extrabold text-slate-950">Live in Nizamabad</span> · 15-min response</span>
              </motion.div>

              <h1 className="mt-5 sm:mt-7 text-[2.65rem] leading-[1.05] sm:text-6xl lg:text-[4.6rem] font-black text-slate-950 tracking-[-0.04em]">
                <AnimatedWords text="Hospital-grade care," delay={0.05} />
                <AnimatedWords
                  text="right at home."
                  delay={0.3}
                  className="block italic font-normal tracking-[-0.02em] text-slate-700"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.12 }}
                className="mt-5 text-slate-600 text-[15px] sm:text-lg leading-relaxed max-w-xl"
              >
                Certified doctors, 24/7 ICU bedside nurses, emergency ambulances and complete home ICU setups — with zero advance payment.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.18 }}
                className="mt-7 flex flex-col sm:flex-row gap-3"
              >
                <Link
                  to="/book"
                  className="btn-liquid-ink group h-14 pl-6 pr-2 rounded-full flex items-center justify-between sm:justify-center gap-4 text-[15px] font-bold active:scale-[0.98] transition-transform"
                >
                  <span>Book a home visit</span>
                  <span className="h-10 w-10 rounded-full bg-white text-slate-950 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <a
                  href={`tel:${cleanPhone}`}
                  className="liquid-glass h-14 pl-2 pr-6 rounded-full flex items-center gap-3 text-[15px] font-bold text-slate-900 active:scale-[0.98] transition-transform"
                >
                  <span className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                    <PhoneCall className="w-4 h-4" />
                  </span>
                  <span className="flex flex-col leading-tight text-left">
                    <span className="text-[11px] font-semibold text-slate-500">24/7 Helpline</span>
                    <span>{phone}</span>
                  </span>
                </a>
              </motion.div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-7 flex items-center gap-3"
              >
                <div className="flex -space-x-2.5">
                  {FALLBACK_DOCTORS.map((d) => (
                    <img
                      key={d._id}
                      src={d.image}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                    />
                  ))}
                </div>
                <div className="text-[13px] leading-tight">
                  <div className="flex items-center gap-1 font-extrabold text-slate-950">
                    4.9
                    <span className="flex">
                      {[0, 1, 2, 3, 4].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                    </span>
                  </div>
                  <div className="text-slate-500 font-medium">Trusted by 10,000+ Nizamabad families</div>
                </div>
              </motion.div>

              {/* Key numbers */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.35 }}
                className="liquid-glass mt-9 sm:mt-12 rounded-[1.5rem] grid grid-cols-3 divide-x divide-slate-900/[0.07] py-4 sm:py-5 max-w-2xl"
              >
                {[
                  { value: <CountUp to={15} suffix=" min" />, label: 'Dispatch' },
                  { value: <CountUp to={10} suffix="k+" />, label: 'Patients' },
                  { value: <><CountUp to={24} duration={1.2} />/7</>, label: 'Standby' }
                ].map(s => (
                  <div key={s.label} className="px-2 text-center">
                    <div className="text-xl sm:text-3xl font-black tracking-tight leading-none text-slate-950">{s.value}</div>
                    <div className="mt-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

          </div>
          </div>
        </section>

        {/* ========================================================
            2. SERVICES
        ======================================================== */}
        <section className="pt-2 pb-10 sm:pt-6 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
          <Reveal>
            <SectionHeader
              eyebrow="Specialized Medical Services"
              title="Clinical care services in Nizamabad"
              desc="Choose what you need. Our medical team coordinates bedside arrival and hospital-grade setups."
              link={{ to: '/services', label: 'All treatments' }}
            />
          </Reveal>

          <SnapRail className="md:grid-cols-2 lg:grid-cols-3">
            {LUXURY_SERVICES.map((serv) => {
              const Icon = serv.icon;
              return (
                <motion.button
                  type="button"
                  key={serv.id}
                  variants={CARD_VARIANTS}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBookService(serv.title)}
                  className="snap-start shrink-0 w-[82%] sm:w-[58%] md:w-auto relative h-[440px] sm:h-[460px] rounded-[1.75rem] overflow-hidden text-left group shadow-[0_20px_40px_-20px_rgba(15,23,42,0.4)]"
                  aria-label={`Book ${serv.title}`}
                >
                  <img
                    src={serv.image}
                    alt={serv.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-slate-950/10" />

                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    <span className={`liquid-glass-clear px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${serv.emergency ? '!bg-rose-500/70 !border-rose-200/40' : ''}`}>
                      {serv.badge}
                    </span>
                    <span className="liquid-glass-clear h-11 w-11 rounded-full flex items-center justify-center group-hover:rotate-6 transition-transform">
                      <Icon className="w-5 h-5" />
                    </span>
                  </div>

                  <div className="liquid-glass-clear absolute bottom-3 left-3 right-3 rounded-[1.35rem] p-4 sm:p-5">
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight tracking-tight">
                      {serv.title}
                    </h3>
                    <p className="mt-1.5 text-white/80 text-[13px] leading-relaxed line-clamp-2">
                      {serv.desc}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {serv.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-semibold text-white/90 bg-white/10 border border-white/15 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[13px] font-bold text-white">Book appointment</span>
                      <span className="h-9 w-9 rounded-full bg-white text-slate-950 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </SnapRail>
        </section>

        {/* ========================================================
            3. EMERGENCY AMBULANCE BANNER
        ======================================================== */}
        <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-600 via-rose-600 to-red-700 text-white p-6 sm:p-10 shadow-[0_30px_60px_-25px_rgba(225,29,72,0.6)]">

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="liquid-glass-clear inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    <Truck className="w-3.5 h-3.5" />
                    24/7 Emergency Response
                  </div>
                  <h3 className="text-[1.65rem] sm:text-4xl font-black text-white tracking-[-0.03em] leading-[1.1]">
                    Need an ICU ambulance in Nizamabad?
                  </h3>
                  <p className="text-rose-50/90 text-[15px] sm:text-base leading-relaxed">
                    Invasive ICU ventilators, multipara monitors, oxygen manifolds and trained emergency paramedics.
                  </p>
                </div>

                <a
                  href={`tel:${cleanPhone}`}
                  className="shrink-0 h-14 pl-2 pr-6 rounded-full bg-white text-rose-700 flex items-center justify-center md:justify-start gap-3 font-black text-[15px] shadow-[inset_0_-2px_0_rgba(0,0,0,0.06),0_14px_30px_-10px_rgba(0,0,0,0.35)] active:scale-[0.98] transition-transform"
                >
                  <span className="relative h-10 w-10 rounded-full bg-rose-600 text-white flex items-center justify-center">
                    <span className="anim-live-pulse absolute inset-0 rounded-full bg-rose-500" />
                    <PhoneCall className="relative w-4 h-4" />
                  </span>
                  <span>Call {phone}</span>
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ========================================================
            4. DOCTORS
        ======================================================== */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
          <Reveal>
            <SectionHeader
              eyebrow="Verified Board Specialists"
              title="Experienced home physicians"
              desc="Senior consultants and ICU doctors available for bedside visits across Nizamabad."
              link={{ to: '/about', label: 'All doctors' }}
            />
          </Reveal>

          <SnapRail className="md:grid-cols-3">
            {displayDoctors.map((doc) => (
              <motion.div
                key={doc._id || doc.name}
                variants={CARD_VARIANTS}
                className="liquid-glass snap-start shrink-0 w-[85%] sm:w-[60%] md:w-auto rounded-[1.75rem] p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={resolveImageUrl(doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400')}
                        alt={doc.name}
                        loading="lazy"
                        className="w-[72px] h-[72px] rounded-2xl object-cover ring-1 ring-white shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-[3px] ring-white" title="On duty" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-[0.14em]">On duty</span>
                      <h4 className="text-[17px] font-black text-slate-950 leading-tight mt-0.5">{doc.name}</h4>
                      <p className="text-[13px] font-semibold text-slate-600 mt-1 leading-snug">{doc.specialty}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-white/60 border border-white/80 px-3 py-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qualification</div>
                      <div className="text-[12px] font-bold text-slate-800 mt-0.5 leading-snug">{doc.qualifications}</div>
                    </div>
                    <div className="rounded-xl bg-white/60 border border-white/80 px-3 py-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience</div>
                      <div className="text-[12px] font-bold text-slate-800 mt-0.5 leading-snug">{doc.experience}</div>
                    </div>
                  </div>

                  <div className="mt-2 rounded-xl bg-white/60 border border-white/80 px-3 py-2.5 text-[12px] text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate font-semibold">{doc.availability}</span>
                  </div>
                </div>

                <Link
                  to="/book"
                  state={{ selectService: 'Doctor Consultation' }}
                  className="btn-liquid-ink mt-5 h-12 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold active:scale-[0.98] transition-transform"
                >
                  <span>Book home visit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </SnapRail>
        </section>

        {/* ========================================================
            5. VALUE PILLARS
        ======================================================== */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
          <Reveal>
            <SectionHeader eyebrow="Safety & Quality Rigor" title="Why Nizamabad families trust us" />
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {LUXURY_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delay={i * 0.06}>
                  <div className="liquid-glass h-full rounded-[1.5rem] p-4 sm:p-6">
                    <div className="btn-liquid-ink h-11 w-11 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="mt-4 text-[15px] sm:text-base font-black text-slate-950 leading-tight">
                      {pillar.title}
                    </h4>
                    <p className="mt-1.5 text-[13px] sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            6. NIZAMABAD COVERAGE (LOCAL SEO)
        ======================================================== */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0a0a0c] text-white p-6 sm:p-12 shadow-[0_40px_80px_-30px_rgba(2,6,23,0.7)]">

              <div className="relative space-y-7">
                <div className="space-y-3 max-w-3xl">
                  <Eyebrow tone="dark">
                    <MapPin className="w-3.5 h-3.5" />
                    Nizamabad & Northern Telangana
                  </Eyebrow>
                  <h2 className="text-[1.75rem] leading-[1.1] sm:text-4xl font-black text-white tracking-[-0.03em]">
                    24/7 home healthcare across Nizamabad District
                  </h2>
                  <p className="text-slate-300 text-[15px] sm:text-base leading-relaxed">
                    Whether you need an emergency home ICU setup in Kanteshwar, a 24-hour bedside nurse in Subhash Nagar, or doctor visits in Armoor and Bodhan, our clinical network reaches your doorstep within 15 to 30 minutes.
                  </p>
                </div>

                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                  {LOCALITIES.map((loc) => (
                    <li key={loc.name} className="liquid-glass-dark rounded-2xl px-3.5 py-3">
                      <div className="text-white font-bold text-[13px] sm:text-sm">{loc.name}</div>
                      <div className="text-emerald-300 text-[11px] font-semibold mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {loc.tag}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/10 pt-6">
                  <div className="text-white/90 font-bold text-[11px] uppercase tracking-[0.16em] mb-3">Top services in Nizamabad</div>
                  <div className="flex flex-wrap gap-2">
                    {SEO_KEYWORDS.map(k => (
                      <span key={k} className="liquid-glass-dark px-3 py-1.5 rounded-full text-[12px] text-slate-200 font-medium">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ========================================================
            7. FAQ
        ======================================================== */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-left">
          <Reveal>
            <SectionHeader eyebrow="Got questions?" title="Frequently asked questions" />
          </Reveal>

          <div className="space-y-3">
            {displayFaqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              const questionText = faq.q || faq.question;
              const answerText = faq.a || faq.answer;
              const panelId = `faq-panel-${idx}`;
              return (
                <div key={idx} className={`liquid-glass rounded-[1.35rem] transition-shadow ${isOpen ? 'shadow-lg' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 font-bold text-[15px] sm:text-base text-slate-950 cursor-pointer"
                  >
                    <span>{questionText}</span>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'btn-liquid-ink rotate-45' : 'bg-white/70 border border-white text-slate-700'}`}>
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-6 pb-5 text-[14px] sm:text-[15px] text-slate-600 leading-relaxed">
                        {answerText}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            8. FINAL CTA
        ======================================================== */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0a0a0c] text-white px-6 pt-10 pb-24 sm:px-14 sm:pt-14 sm:pb-28 text-center shadow-[0_40px_80px_-30px_rgba(2,6,23,0.6)]">
              <div aria-hidden="true" className="horizon horizon-dark" style={{ '--horizon-rise': '64px', width: 'max(160%, 720px)' }} />
              <div className="relative">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="anim-live-pulse absolute inset-0 rounded-full bg-emerald-400" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  24/7 clinical standby
                </span>
                <h3 className="mt-4 text-[1.9rem] sm:text-5xl font-black text-white tracking-[-0.035em] leading-[1.05]">
                  Need medical help{' '}
                  <span className="italic font-normal text-white/80" style={{ fontFamily: "'Playfair Display', serif" }}>right now?</span>
                </h3>
                <p className="mt-4 text-slate-300 text-[15px] sm:text-base max-w-lg mx-auto leading-relaxed">
                  Submit your care request online or speak with our clinical coordinator directly on WhatsApp.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto">
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/book"
                      className="h-14 px-7 rounded-full flex items-center justify-center gap-2 text-[15px] font-bold bg-white text-slate-950 shadow-[inset_0_-2px_0_rgba(0,0,0,0.06)]"
                    >
                      <HeartPulse className="w-5 h-5 text-rose-500" />
                      <span>Book care now</span>
                    </Link>
                  </motion.div>
                  <motion.a
                    whileTap={{ scale: 0.97 }}
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-14 px-7 rounded-full flex items-center justify-center gap-2 text-[15px] font-bold text-white bg-gradient-to-b from-emerald-500 to-emerald-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_24px_-8px_rgba(5,150,105,0.6)]"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Chat on WhatsApp</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

      </div>
    </MotionConfig>
  );
};

export default Home;
