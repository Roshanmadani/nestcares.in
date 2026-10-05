import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope, Truck, HeartPulse, Activity, Microscope, UserCheck, Apple,
  Zap, Sunrise, Sun, Moon, Check, ArrowRight, ArrowLeft, Loader2, AlertCircle,
  MessageSquare, Copy, CheckCheck, PhoneCall, Pencil, Plus, ShieldCheck
} from 'lucide-react';
import { bookingsAPI, getErrorMessage } from '../services/api';

// Used when the API has no services (offline / first load)
const DEFAULT_SERVICES = [
  {
    title: 'Doctor Consultation',
    sub: [
      { name: 'Home Doctor Visit', desc: 'An MBBS / MD physician examines the patient at home.' },
      { name: 'Tele Consultation', desc: 'Phone or video consultation with a physician.' },
      { name: 'Specialist Doctor Visit', desc: 'Cardiology, neurology, orthopaedics or pulmonology.' }
    ]
  },
  {
    title: 'Ambulance Services',
    sub: [
      { name: 'Emergency Response Ambulance', desc: 'Basic life support with oxygen and a paramedic.' },
      { name: 'ICU Ventilator Ambulance', desc: 'Advanced life support with ventilator and monitor.' },
      { name: 'Inter-City Patient Transport', desc: 'Long-distance transfer with monitoring.' }
    ]
  },
  {
    title: 'Nursing Services',
    sub: [
      { name: 'General Nursing Care (12h / 24h Shift)', desc: 'Vitals, hygiene and medication at the bedside.' },
      { name: '24/7 Live-in Home Nursing', desc: 'Round-the-clock nursing for critical recovery.' },
      { name: 'Wound Dressing & Stitch Removal', desc: 'Surgical, diabetic or trauma wound care.' },
      { name: 'Bed Sore Care & Management', desc: 'Dressings, positioning and air bed setup.' },
      { name: "Tracheostomy / Ryle's Tube Care", desc: 'Suctioning, cannula and stoma care.' }
    ]
  },
  {
    title: 'ICU Setup at Home',
    sub: [
      { name: 'Complete Home ICU Setup', desc: 'Bed, ventilator, monitor, oxygen and ICU nurse.' },
      { name: 'ICU Hospital Bed Rental', desc: 'Motorised hospital bed with remote.' },
      { name: 'Multipara Patient Monitor', desc: 'ECG, SpO2, BP, respiration, temperature.' },
      { name: 'BiPAP / CPAP Machine Setup', desc: 'Non-invasive ventilation with mask fitting.' },
      { name: 'Oxygen Concentrator (10L / 5L)', desc: 'Continuous medical-grade oxygen.' }
    ]
  },
  {
    title: 'Laboratory Services',
    sub: [
      { name: 'Home Blood Sample Collection', desc: 'A phlebotomist collects samples at home.' },
      { name: 'Complete Health Package (60+ Tests)', desc: 'CBC, lipids, liver, kidney, thyroid, sugar.' },
      { name: 'Cardiac & Diabetic Profile', desc: 'HbA1c, fasting sugar, lipids, creatinine.' }
    ]
  },
  {
    title: 'Physiotherapy',
    sub: [
      { name: 'Home Physiotherapy Session', desc: '45-minute session with a physiotherapist.' },
      { name: 'Post-Surgery Joint Rehabilitation', desc: 'Knee / hip replacement recovery.' },
      { name: 'Neurological & Stroke Recovery', desc: "Stroke, Parkinson's or paralysis rehab." }
    ]
  },
  {
    title: 'Dietician Advisory',
    sub: [
      { name: 'Personalized Clinical Diet Plan', desc: 'Nutrition chart based on reports and lifestyle.' },
      { name: 'Diabetes & Renal Diet Consultation', desc: 'Sugar-control and kidney-friendly diets.' }
    ]
  }
];

// Pick an icon from words in the service title
const ICON_RULES = [
  [/ambulance|transport/i, Truck],
  [/nurs/i, HeartPulse],
  [/icu|equipment|oxygen/i, Activity],
  [/lab|test|diagnos/i, Microscope],
  [/physio|rehab/i, UserCheck],
  [/diet|nutrition/i, Apple],
];
const iconFor = (title = '') => (ICON_RULES.find(([re]) => re.test(title)) || [null, Stethoscope])[1];

// Match a title coming from another page ("Professional Home Nursing") to a booking category ("Nursing Services")
const STOP_WORDS = new Set(['home', 'services', 'service', 'professional', 'the', 'and', 'at', 'setup']);
const keywords = (s = '') => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
const findCategory = (list, title) => {
  if (!title) return null;
  const exact = list.find(s => s.title.toLowerCase() === title.toLowerCase());
  if (exact) return exact;
  const want = keywords(title).map(w => w.slice(0, 5));
  let best = null;
  let bestScore = 0;
  list.forEach(s => {
    const have = keywords(s.title).map(w => w.slice(0, 5));
    const score = want.filter(w => have.includes(w)).length;
    if (score > bestScore) { best = s; bestScore = score; }
  });
  return best;
};

const TIME_SLOTS = [
  { id: 'Immediate (within 30 mins)', label: 'Right now', time: 'Within 30 mins', icon: Zap },
  { id: 'Morning (08:00 AM - 12:00 PM)', label: 'Morning', time: '8 AM – 12 PM', icon: Sunrise },
  { id: 'Afternoon (12:00 PM - 04:00 PM)', label: 'Afternoon', time: '12 – 4 PM', icon: Sun },
  { id: 'Evening (04:00 PM - 08:00 PM)', label: 'Evening', time: '4 – 8 PM', icon: Moon }
];

const AREAS = ['Subhash Nagar', 'Pragathi Nagar', 'Kanteshwar', 'Vinayak Nagar', 'Khaleelwadi', 'Chandra Shekar Colony', 'Armoor Road', 'Bodhan Road'];

const STEPS = ['Service', 'When & where', 'Your details'];

// Local YYYY-MM-DD (toISOString would give the UTC date, which is wrong early in the Indian morning)
const localDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const prettyDate = (value) => {
  if (value === localDate(0)) return 'Today';
  if (value === localDate(1)) return 'Tomorrow';
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
};

const HELPLINE = '+91 92488 49388';
const WHATSAPP = '919248849388';

const cx = (...c) => c.filter(Boolean).join(' ');

const StepHeading = ({ title, desc }) => (
  <div className="mb-5">
    <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">{title}</h2>
    {desc && <p className="text-[14px] text-slate-500 mt-1">{desc}</p>}
  </div>
);

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-[14px] font-bold text-slate-900 mb-2">{children}</label>
);

const FieldError = ({ children }) => children ? (
  <p className="mt-1.5 text-[13px] font-semibold text-rose-600 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{children}</p>
) : null;

const inputClass = (error) => cx(
  'w-full rounded-2xl bg-white border px-4 text-[16px] text-slate-950 placeholder:text-slate-400 outline-none transition focus:ring-4',
  error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/5'
);

const BookingForm = ({
  services = [],
  preSelectedCategory = '',
  preSelectedSubService = '',
  preSelectedMobile = '',
  preSelectedAddress = '',
  onSuccess = null
}) => {
  const categories = useMemo(() => {
    const fromApi = (Array.isArray(services) ? services : [])
      .filter(s => s && s.active !== false && s.bookable !== false)
      .map(s => {
        const subs = (s.subServices || [])
          .map(sub => (typeof sub === 'string' ? { name: sub } : sub))
          .filter(sub => sub?.name && sub.active !== false && sub.bookable !== false)
          .map(sub => ({ name: sub.name, desc: sub.description || sub.desc || '' }));
        return { title: s.title, sub: subs.length ? subs : [{ name: s.title, desc: s.shortDescription || '' }] };
      });
    return fromApi.length ? fromApi : DEFAULT_SERVICES;
  }, [services]);

  const initialCategory = findCategory(categories, preSelectedCategory);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => ({
    serviceName: initialCategory?.title || '',
    subServiceName: (initialCategory && (initialCategory.sub.find(s => s.name === preSelectedSubService)?.name || (initialCategory.sub.length === 1 ? initialCategory.sub[0].name : ''))) || '',
    preferredDate: localDate(0),
    preferredTime: TIME_SLOTS[0].id,
    address: preSelectedAddress || '',
    name: '',
    mobile: (preSelectedMobile || '').replace(/\D/g, '').slice(-10),
    email: '',
    notes: ''
  }));
  const [errors, setErrors] = useState({});
  const [showOtherDate, setShowOtherDate] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [copied, setCopied] = useState(false);
  const topRef = useRef(null);
  const treatmentsRef = useRef(null);

  // Apply a pre-selection that arrives after the first render (services loading late)
  useEffect(() => {
    if (form.serviceName) return;
    const match = findCategory(categories, preSelectedCategory);
    if (match) {
      setForm(f => ({
        ...f,
        serviceName: match.title,
        subServiceName: match.sub.find(s => s.name === preSelectedSubService)?.name || (match.sub.length === 1 ? match.sub[0].name : '')
      }));
    }
  }, [categories, preSelectedCategory, preSelectedSubService]);

  const category = categories.find(c => c.title === form.serviceName);

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const chooseCategory = (c) => {
    setForm(f => ({ ...f, serviceName: c.title, subServiceName: c.sub.length === 1 ? c.sub[0].name : '' }));
    setErrors({});
    // On phones, bring the treatment list into view
    setTimeout(() => treatmentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const addArea = (area) => {
    const current = form.address.trim();
    if (current.toLowerCase().includes(area.toLowerCase())) return;
    update('address', current ? `${current.replace(/,?\s*Nizamabad$/i, '')}, ${area}, Nizamabad` : `${area}, Nizamabad`);
  };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.serviceName) e.serviceName = 'Choose a service';
      else if (!form.subServiceName) e.subServiceName = 'Choose what you need';
    }
    if (s === 2) {
      if (!form.preferredDate) e.preferredDate = 'Choose a date';
      if (form.address.trim().length < 8) e.address = 'Enter the full address with house number and area';
    }
    if (s === 3) {
      if (form.name.trim().length < 2) e.name = "Enter the patient's name";
      if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goTo = (n) => {
    setStep(n);
    setSubmitError('');
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const next = () => { if (validate(step)) goTo(step + 1); };

  const payload = () => ({
    name: form.name.trim(),
    mobile: form.mobile,
    email: form.email.trim(),
    address: form.address.trim(),
    serviceName: form.serviceName,
    subServiceName: form.subServiceName,
    preferredDate: form.preferredDate,
    preferredTime: form.preferredTime,
    notes: form.notes.trim()
  });

  const submit = async (e) => {
    e?.preventDefault();
    if (step < 3) return next();
    if (!validate(3)) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await bookingsAPI.createBooking(payload());
      const record = res?.data || payload();
      setConfirmed(record);
      onSuccess?.(record);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'We could not submit your booking.'));
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappFallback = () => {
    const p = payload();
    const text = `Hello Nest Cares, I'd like to book:\n• Service: ${p.serviceName} — ${p.subServiceName}\n• When: ${prettyDate(p.preferredDate)}, ${p.preferredTime}\n• Patient: ${p.name}\n• Mobile: ${p.mobile}\n• Address: ${p.address}${p.notes ? `\n• Notes: ${p.notes}` : ''}`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  };

  // ---------- Success ----------
  if (confirmed) {
    const ref = confirmed.bookingId || confirmed._id;
    return (
      <div ref={topRef} className="scroll-mt-28 bg-white rounded-[1.75rem] border border-slate-200/80 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)] p-6 sm:p-10 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <h2 className="mt-5 text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Booking received</h2>
        <p className="mt-2 text-[15px] text-slate-600 max-w-md mx-auto">
          Our coordinator will call <strong className="text-slate-950">{confirmed.mobile}</strong> within 15 minutes to confirm the visit.
        </p>

        {ref && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 pl-4 pr-2 py-2">
            <div className="text-left">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Booking ID</div>
              <div className="font-mono font-bold text-slate-950">{ref}</div>
            </div>
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(ref); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
              className="h-9 px-3 rounded-xl bg-white border border-slate-200 text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}

        <dl className="mt-6 max-w-sm mx-auto text-left text-[14px] divide-y divide-slate-100 border-y border-slate-100">
          <div className="flex justify-between gap-4 py-2.5"><dt className="text-slate-500">Service</dt><dd className="font-semibold text-slate-950 text-right">{confirmed.subServiceName || confirmed.serviceName}</dd></div>
          <div className="flex justify-between gap-4 py-2.5"><dt className="text-slate-500">When</dt><dd className="font-semibold text-slate-950 text-right">{prettyDate(confirmed.preferredDate)} · {TIME_SLOTS.find(t => t.id === confirmed.preferredTime)?.label || confirmed.preferredTime}</dd></div>
          <div className="flex justify-between gap-4 py-2.5"><dt className="text-slate-500">Patient</dt><dd className="font-semibold text-slate-950 text-right">{confirmed.name}</dd></div>
        </dl>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Nest Cares, I just booked ${confirmed.serviceName}${ref ? ` (ID ${ref})` : ''} for ${confirmed.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-6 rounded-full bg-emerald-600 text-white font-bold text-[15px] flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Message us on WhatsApp
          </a>
          <Link to="/" className="h-12 px-6 rounded-full bg-slate-100 text-slate-900 font-bold text-[15px] flex items-center justify-center">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const slot = TIME_SLOTS.find(t => t.id === form.preferredTime);
  const isLast = step === 3;

  // ---------- Form ----------
  return (
    <form onSubmit={submit} noValidate ref={topRef} className="scroll-mt-28">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-[13px] font-semibold mb-2">
          <span className="text-slate-950">Step {step} of 3 · {STEPS[step - 1]}</span>
          <a href={`tel:${HELPLINE.replace(/\s/g, '')}`} className="text-slate-500 hover:text-slate-950 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5" /> <span>Prefer to call?</span>
          </a>
        </div>
        <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
          {STEPS.map((_, i) => (
            <div key={i} className={cx('h-1.5 rounded-full transition-colors', i < step ? 'bg-slate-950' : 'bg-slate-200')} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[1.75rem] border border-slate-200/80 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)] p-5 sm:p-8">

        {/* ---------- STEP 1 ---------- */}
        {step === 1 && (
          <div>
            <StepHeading title="What do you need?" desc="Pick a service, then the type of care." />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Service">
              {categories.map(c => {
                const Icon = iconFor(c.title);
                const selected = form.serviceName === c.title;
                return (
                  <button
                    key={c.title}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => chooseCategory(c)}
                    className={cx(
                      'relative min-h-[88px] rounded-2xl border p-3.5 text-left flex flex-col justify-between gap-2 transition-all cursor-pointer active:scale-[0.98]',
                      selected ? 'border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/15' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400'
                    )}
                  >
                    <Icon className={cx('w-5 h-5', selected ? 'text-emerald-300' : 'text-slate-500')} />
                    <span className="text-[14px] font-bold leading-snug">{c.title}</span>
                    {selected && <Check className="absolute top-3 right-3 w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
            <FieldError>{errors.serviceName}</FieldError>

            {category && (
              <div ref={treatmentsRef} className="mt-7 scroll-mt-28">
                <Label>Type of care</Label>
                <div className="space-y-2" role="radiogroup" aria-label="Type of care">
                  {category.sub.map(sub => {
                    const selected = form.subServiceName === sub.name;
                    return (
                      <button
                        key={sub.name}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => update('subServiceName', sub.name)}
                        className={cx(
                          'w-full rounded-2xl border px-4 py-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer',
                          selected ? 'border-slate-950 bg-slate-50 ring-1 ring-slate-950' : 'border-slate-200 hover:border-slate-400'
                        )}
                      >
                        <span className={cx('mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0', selected ? 'border-slate-950 bg-slate-950' : 'border-slate-300')}>
                          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[15px] font-semibold text-slate-950">{sub.name}</span>
                          {sub.desc && <span className="block text-[13px] text-slate-500 mt-0.5 leading-snug">{sub.desc}</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <FieldError>{errors.subServiceName}</FieldError>
              </div>
            )}
          </div>
        )}

        {/* ---------- STEP 2 ---------- */}
        {step === 2 && (
          <div className="space-y-7">
            <StepHeading title="When and where?" desc="We'll confirm the exact time when we call you." />

            <div>
              <Label>Day</Label>
              <div className="grid grid-cols-3 gap-2">
                {[{ label: 'Today', value: localDate(0) }, { label: 'Tomorrow', value: localDate(1) }].map(d => {
                  const selected = !showOtherDate && form.preferredDate === d.value;
                  return (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => { setShowOtherDate(false); update('preferredDate', d.value); }}
                      className={cx('h-12 rounded-2xl border text-[15px] font-semibold cursor-pointer transition-colors',
                        selected ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 text-slate-800 hover:border-slate-400')}
                    >
                      {d.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => { setShowOtherDate(true); if (form.preferredDate <= localDate(1)) update('preferredDate', localDate(2)); }}
                  className={cx('h-12 rounded-2xl border text-[15px] font-semibold cursor-pointer transition-colors',
                    showOtherDate ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 text-slate-800 hover:border-slate-400')}
                >
                  Other day
                </button>
              </div>
              {showOtherDate && (
                <input
                  type="date"
                  aria-label="Choose a date"
                  min={localDate(0)}
                  value={form.preferredDate}
                  onChange={(e) => update('preferredDate', e.target.value)}
                  className={cx(inputClass(errors.preferredDate), 'h-12 mt-2')}
                />
              )}
              <FieldError>{errors.preferredDate}</FieldError>
            </div>

            <div>
              <Label>Time</Label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map(t => {
                  const selected = form.preferredTime === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => update('preferredTime', t.id)}
                      className={cx('rounded-2xl border px-3.5 py-3 text-left flex items-center gap-3 cursor-pointer transition-colors',
                        selected ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 text-slate-900 hover:border-slate-400')}
                    >
                      <t.icon className={cx('w-5 h-5 shrink-0', selected ? 'text-amber-300' : 'text-slate-400')} />
                      <span className="min-w-0 leading-tight">
                        <span className="block text-[15px] font-semibold">{t.label}</span>
                        <span className={cx('block text-[12px]', selected ? 'text-white/70' : 'text-slate-500')}>{t.time}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="bf-address">Patient's address in Nizamabad</Label>
              <textarea
                id="bf-address"
                rows={3}
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="House no., street, landmark"
                autoComplete="street-address"
                className={cx(inputClass(errors.address), 'py-3 resize-none')}
              />
              <FieldError>{errors.address}</FieldError>
              <div className="mt-2.5">
                <div className="text-[12px] font-semibold text-slate-500 mb-1.5">Tap to add your area</div>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
                  {AREAS.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => addArea(a)}
                      className="h-9 px-3 rounded-full border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 hover:border-slate-400 shrink-0 cursor-pointer"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------- STEP 3 ---------- */}
        {step === 3 && (
          <div className="space-y-6">
            <StepHeading title="Who is the patient?" desc="We'll call this number to confirm." />

            {/* Summary */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 divide-y divide-slate-200/70 text-[14px]">
              <button type="button" onClick={() => goTo(1)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer">
                <span className="min-w-0">
                  <span className="block text-[12px] text-slate-500">Service</span>
                  <span className="block font-semibold text-slate-950 truncate">{form.subServiceName}</span>
                </span>
                <Pencil className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
              <button type="button" onClick={() => goTo(2)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer">
                <span className="min-w-0">
                  <span className="block text-[12px] text-slate-500">When & where</span>
                  <span className="block font-semibold text-slate-950 truncate">{prettyDate(form.preferredDate)} · {slot?.label}</span>
                  <span className="block text-slate-600 truncate">{form.address}</span>
                </span>
                <Pencil className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>

            <div>
              <Label htmlFor="bf-name">Patient name</Label>
              <input
                id="bf-name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                autoComplete="name"
                placeholder="Full name"
                className={cx(inputClass(errors.name), 'h-12')}
              />
              <FieldError>{errors.name}</FieldError>
            </div>

            <div>
              <Label htmlFor="bf-mobile">Mobile number</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-slate-500 pointer-events-none">+91</span>
                <input
                  id="bf-mobile"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={form.mobile}
                  onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit number"
                  className={cx(inputClass(errors.mobile), 'h-12 pl-14 tracking-wide')}
                />
              </div>
              <FieldError>{errors.mobile}</FieldError>
            </div>

            {showExtras ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bf-notes">Notes for the care team <span className="font-normal text-slate-400">(optional)</span></Label>
                  <textarea
                    id="bf-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    placeholder="Symptoms, age, oxygen needed, recent surgery…"
                    className={cx(inputClass(false), 'py-3 resize-none')}
                  />
                </div>
                <div>
                  <Label htmlFor="bf-email">Email <span className="font-normal text-slate-400">(optional, for a confirmation email)</span></Label>
                  <input
                    id="bf-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={cx(inputClass(false), 'h-12')}
                  />
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setShowExtras(true)} className="text-[14px] font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1.5 cursor-pointer">
                <Plus className="w-4 h-4" /> Add notes or email (optional)
              </button>
            )}

            <p className="text-[13px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              No advance payment. You pay only after care is delivered.
            </p>

            {submitError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4" role="alert">
                <div className="flex items-start gap-2.5 text-[14px] font-semibold text-rose-800">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{submitError} Your details are still here — try again, or send them to us on WhatsApp.</span>
                </div>
                <a
                  href={whatsappFallback()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 h-11 rounded-xl bg-emerald-600 text-white font-bold text-[14px] flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Send booking on WhatsApp
                </a>
              </div>
            )}
          </div>
        )}

        {/* ---------- Actions ---------- */}
        <div className="fixed md:static bottom-0 inset-x-0 z-40 bg-white/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t border-slate-200 md:border-0 px-4 md:px-0 pt-3 md:pt-8 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-0">
          <div className="flex gap-2 max-w-5xl mx-auto">
            {step > 1 && (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                aria-label="Back"
                className="h-[52px] w-[52px] md:w-auto md:px-6 rounded-full border border-slate-200 bg-white text-slate-800 font-bold text-[15px] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" /> <span className="hidden md:inline">Back</span>
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-liquid-ink flex-1 md:flex-none md:ml-auto md:min-w-[14rem] h-[52px] px-6 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer active:scale-[0.99] transition-transform"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Booking…</>
              ) : isLast ? (
                <>Confirm booking <Check className="w-5 h-5" /></>
              ) : (
                <>Continue <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BookingForm;
