import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Award, HeartHandshake, CheckCircle2, Star, Users, ShieldAlert, BadgeCheck, Network, ClipboardCheck, ShieldCheck, Stethoscope, Clock } from 'lucide-react';

import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { SectionHeading } from '../components/common/Typography';
import PageLayout from '../components/common/PageLayout';
import { translations } from '../utils/translations';
import { resolveImageUrl } from '../utils/url';

const About = ({ doctors, founders }) => {
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('preferred_language') || 'english');

  useEffect(() => {
    const syncLang = () => {
      setCurrentLang(localStorage.getItem('preferred_language') || 'english');
    };
    window.addEventListener('languageChanged', syncLang);
    return () => window.removeEventListener('languageChanged', syncLang);
  }, []);

  const isTe = currentLang === 'telugu';
  const t = (key, fallback) => translations[isTe ? 'TE' : 'EN'][key] || fallback;
  useEffect(() => {
    document.title = "About Nest Cares | #1 Trusted Home Healthcare in Nizamabad";
  }, []);

  const displayFounders = founders && founders.length > 0 ? founders : [
    {
      name: 'Dr. Anand Verma',
      role: 'Founder & Chief Medical Director',
      experience: '22+ Years Experience',
      bio: 'Our mission is to bring high-acuity critical care directly to patient bedrooms in Nizamabad, ensuring families recover together.',
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Dr. Priya Naidu',
      role: 'Co-founder & Chief Clinical Strategist',
      experience: '15+ Years Experience',
      bio: 'By establishing professional home nursing standards, we guarantee safety and clinical reliability for every recovery.',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
    }
  ];

  const displayDoctors = doctors && doctors.length > 0 ? doctors.filter(d => d.isActive !== false && d.active !== false) : [
    {
      _id: 'doc_1',
      name: 'Dr. K. Srinivas Reddy',
      qualifications: 'MBBS, MD (General Medicine)',
      experience: '14+ Years Experience',
      regNumber: 'TSMC/2012/4819',
      bio: 'Specializes in comprehensive home health evaluations, elderly patient monitoring, chronic disease management, and post-discharge recovery.',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      specialty: 'Senior General Physician & Geriatrician'
    },
    {
      _id: 'doc_2',
      name: 'Dr. Ananya Sharma',
      qualifications: 'MBBS, DA, DNB (Critical Care)',
      experience: '10+ Years Experience',
      regNumber: 'TSMC/2015/6321',
      bio: 'Lead intensive care specialist overseeing home ICU ventilator setups, tracheostomy tube management, and emergency clinical triage.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      specialty: 'Critical Care & ICU Consultant'
    },
    {
      _id: 'doc_3',
      name: 'Dr. M. Venkat Rao',
      qualifications: 'MBBS, MD, DM (Cardiology)',
      experience: '16+ Years Experience',
      regNumber: 'TSMC/2009/2184',
      bio: 'Expert in cardiovascular evaluations, bedside 12-lead ECG reviews, heart failure follow-ups, and cardiac rehabilitation at home.',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      specialty: 'Consultant Cardiologist & Physician'
    }
  ];

  const coreValues = isTe ? [
    { title: 'రోగి-మొదటి ప్రాధాన్యత', desc: 'ప్రతి వైద్య నిర్ణయం మరియు కేర్ షెడ్యూల్ రోగి కోలుకునే సౌకర్యానికి అనుగుణంగా రూపొందించబడుతుంది.', icon: <Heart className="w-5 h-5 text-rose-500" /> },
    { title: 'క్లినికల్ ఎక్సలెన్స్', desc: 'అందరు హోమ్ డాక్టర్లు, ఫిజియోథెరపిస్టులు మరియు నర్సులు కఠినమైన క్లినికల్ సేఫ్టీ గైడ్‌లైన్స్ కింద పనిచేస్తారు.', icon: <Award className="w-5 h-5 text-teal-800" /> },
    { title: 'విశ్వసనీయత & రక్షణ', desc: 'సిబ్బంది అందరికీ కఠినమైన బ్యాక్‌గ్రౌండ్ వెరిఫికేషన్ మరియు సర్టిఫికేట్ చెక్స్ పూర్తి చేయబడతాయి.', icon: <Shield className="w-5 h-5 text-emerald-600" /> },
    { title: 'ఆత్మీయమైన సేవలు', desc: 'మేము మీ కుటుంబ సభ్యులను మా సొంత వారిలా చూసుకుంటాము, మానసిక ధైర్యాన్ని అందిస్తాము.', icon: <HeartHandshake className="w-5 h-5 text-indigo-500" /> }
  ] : [
    {
      title: 'Patient-First Focus',
      desc: 'Every medical decision and care schedule is optimized for patient recovery comfort and convenience.',
      icon: <Heart className="w-5 h-5 text-rose-500" />
    },
    {
      title: 'Clinical Excellence',
      desc: 'All home doctors, physiotherapists, and nurses operate under strict clinical safety guidelines.',
      icon: <Award className="w-5 h-5 text-teal-800" />
    },
    {
      title: 'Trust & Safety',
      desc: 'Rigorous background check verification and credential checks are completed for all staff.',
      icon: <Shield className="w-5 h-5 text-emerald-600" />
    },
    {
      title: 'Empathetic Care',
      desc: 'We care for your loved ones like family, keeping patient emotional well-being at the core.',
      icon: <HeartHandshake className="w-5 h-5 text-indigo-500" />
    }
  ];

  const stats = isTe ? [
    { value: '15,000+', label: 'చికిత్స పొందిన రోగులు' },
    { value: '15 నిమిషాలు', label: 'సగటు స్పందన సమయం' },
    { value: '120+', label: 'నర్సులు & వైద్యులు' },
    { value: '99.2%', label: 'రోగుల సంతృప్తి రేటింగ్' }
  ] : [
    { value: '15,000+', label: 'Patients Coordinated' },
    { value: '15 Min', label: 'Average Triage Callback' },
    { value: '120+', label: 'On-Duty Doctors & ICU Nurses' },
    { value: '99.2%', label: 'Clinical Satisfaction' }
  ];

  const certifications = isTe ? [
    { name: 'NABL గుర్తింపు పొందిన ల్యాబ్‌లు', desc: 'నేషనల్ అక్రిడిటేషన్ బోర్డు ద్వారా ధృవీకరించబడిన డయాగ్నస్టిక్స్ సేవలు.', icon: <BadgeCheck className="w-6 h-6 text-teal-800" /> },
    { name: 'ISO 9001:2015 సర్టిఫైడ్', desc: 'అంతర్జాతీయ ఆరోగ్య నాణ్యతా ప్రమాణాలకు అనుగుణంగా నిర్వహణ.', icon: <ShieldCheck className="w-6 h-6 text-emerald-600" /> },
    { name: 'NABH మార్గదర్శకాలకు లోబడి', desc: 'జాతీయ గుర్తింపు మార్గదర్శకాల ఆధారంగా రూపొందించబడిన సేవలు.', icon: <ClipboardCheck className="w-6 h-6 text-teal-800" /> }
  ] : [
    { name: 'NABL Accredited Labs', desc: 'National Accreditation Board for Testing and Calibration Laboratories certified diagnostics.', icon: <BadgeCheck className="w-6 h-6 text-teal-800" /> },
    { name: 'ISO 9001:2015 Certified', desc: 'Standard international healthcare quality management framework compliant.', icon: <ShieldCheck className="w-6 h-6 text-emerald-600" /> },
    { name: 'NABH Guidelines Compliant', desc: 'Home healthcare setups modeled exactly on national accreditation guidelines.', icon: <ClipboardCheck className="w-6 h-6 text-teal-800" /> }
  ];

  const processSteps = isTe ? [
    { number: '01', title: 'అభ్యర్థన నమోదు', desc: 'మీ కేర్ ప్యాకేజీని ఆన్‌లైన్‌లో ఎంచుకోండి లేదా ఉచిత కాల్‌బ్యాక్ కోసం అభ్యర్థించండి.' },
    { number: '02', title: 'వైద్యుల విశ్లేషణ', desc: 'మా సీనియర్ వైద్యులు నివేదికలను పరిశీలించి చికిత్స ప్రణాళికను సిద్ధం చేస్తారు.' },
    { number: '03', title: 'పరికరాల అమరిక', desc: 'శుభ్రపరచబడిన ఐసీయూ మెషినరీ మీ ఇంట్లో అమర్చబడుతుంది మరియు నర్సులు నియమించబడతారు.' },
    { number: '04', title: 'రోజువారీ నివేదికలు', desc: 'నర్సులు రోగి రోజువారీ నివేదికలను పర్యవేక్షణ కోసం వైద్యులకు సమర్పిస్తారు.' }
  ] : [
    { number: '01', title: 'Triage Submission', desc: 'Select your care package online or submit quick callback phone coordinates.' },
    { number: '02', title: 'Physician Audit', desc: 'Our senior consultants evaluate patient condition reports to build custom care plans.' },
    { number: '03', title: 'Bedside Deployment', desc: 'Sanitized ICU machinery is installed and background-verified nurses are assigned.' },
    { number: '04', title: 'Daily Quality Audits', desc: 'Nurses submit daily vitals logs to consulting doctors for recovery monitoring.' }
  ];

  const partnerHospitals = [
    'Apollo Hospitals Network', 'Fortis Medical Center', 'Max Healthcare Care System', 'Medanta Clinical Group', 'Columbia Asia Hospital'
  ];

  return (
    <PageLayout
      title={isTe ? "మా సేవ కేంద్రం గురించి" : "About Our Care Desk"}
      description={isTe ? "ఆసుపత్రి క్లినికల్ ఖచ్చితత్వానికి మరియు ఇంటి సౌకర్యవంతమైన రికవరీకి మధ్య అనుసంధానం." : "Bridging the gap between hospital clinical accuracy and home recovery comfort."}
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'About' }]}
    >
      
      {/* 1. KEY STATISTICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((st, idx) => (
          <div key={idx} className="glass-card-premium text-center flex flex-col justify-center items-center py-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <span className="text-3xl font-black text-teal-700 tracking-tight">{st.value}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">{st.label}</span>
          </div>
        ))}
      </div>

      {/* 2. INTRODUCTION & MISSION */}
      <div className="glass-card-premium rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12 p-8 border border-slate-200/80 bg-white shadow-sm">
        <div className="lg:col-span-7 flex flex-col gap-4 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-teal-50 text-teal-700 border border-teal-200 w-fit">
            <BadgeCheck className="w-3.5 h-3.5 text-teal-600" />
            Supervised Home Recovery
          </span>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Hospital-Grade Quality. Bedside Comfort.</h2>
          <p className="text-slate-600 text-sm leading-relaxed font-normal">
            Our agency coordinates professional ICU-level medical machinery, expert nursing assistance, and consulting physician home visits directly to your bedroom. We understand that patients heal faster and with less stress when surrounded by their family.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed font-normal">
            By avoiding ambulance commutes, inpatient waiting queues, and heavy hospital room costs, we provide a premium, affordable alternative without compromising on medical standards.
          </p>
        </div>
        
        <div className="lg:col-span-5 grid grid-cols-1 gap-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl">
          <div className="border-l-2 border-teal-600 pl-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Our Mission</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
              To make premium, hospital-grade home recovery accessible, safe, and compassionate, helping seniors recover gracefully.
            </p>
          </div>
          <div className="border-l-2 border-emerald-600 pl-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Our Vision</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
              To emerge as the nation's most trusted, clinical-standard home healthcare partner, recognized for physician-led protocols.
            </p>
          </div>
        </div>
      </div>

      {/* 3. CERTIFICATIONS & ACCREDITATIONS */}
      <div className="mb-12">
        <SectionHeading
          tag="Vetting Standards"
          title="Our Clinical Accreditations"
          description="We operate under strict guidelines to match the safety standards of premium medical centers."
          className="mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <div key={idx} className="glass-card-premium p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm flex gap-4">
              <div className="p-3 bg-teal-50 rounded-2xl text-teal-700 border border-teal-100 shrink-0 flex items-center justify-center h-fit">
                {cert.icon}
              </div>
              <div className="text-left space-y-1">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">{cert.name}</h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">{cert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. OUR PROCESS TIMELINE */}
      <div className="mb-12">
        <SectionHeading
          tag="Onboarding"
          title="Our Clinical Coordination Process"
          description="How we prepare and deploy professional medical setups directly to your bedside."
          className="mb-8"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processSteps.map((step, idx) => (
            <div key={idx} className="glass-card-premium p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm text-left relative space-y-3">
              <div className="absolute top-4 right-4 text-slate-100 font-black text-3xl select-none font-sans">
                {step.number}
              </div>
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-teal-700 text-xs">
                {step.number}
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide pt-1">{step.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CORE PILLARS */}
      <div className="mb-12">
        <SectionHeading
          tag="Our Pillars"
          title="Clinical Pillars of Trust"
          className="mb-8"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreValues.map((val, idx) => (
            <div key={idx} className="glass-card-premium p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm text-left space-y-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl w-fit">
                {val.icon}
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">{val.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PARTNER HOSPITALS */}
      <div className="mb-12 glass-card-premium rounded-3xl p-8 text-center border border-slate-200/80 bg-white shadow-sm">
        <span className="text-xs font-black text-teal-700 uppercase tracking-widest block mb-6">Linked Referral Hospital Networks</span>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {partnerHospitals.map((hosp, idx) => (
            <span key={idx} className="text-xs font-bold text-slate-600 tracking-wider uppercase hover:text-teal-700 transition-all cursor-default">
              {hosp}
            </span>
          ))}
        </div>
      </div>

      {/* 7. FOUNDER & CO-FOUNDER SPOTLIGHT */}
      <div className="mb-12">
        <SectionHeading
          tag="Leadership"
          title="Our Founders' Vision"
          description="The clinical minds bridging the gap between hospital accuracy and home bedside care."
          className="mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayFounders.map((f, idx) => (
            <div key={idx} className="glass-card-premium flex flex-col sm:flex-row gap-6 p-6 relative overflow-hidden group rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all">
              <div className="w-full sm:w-36 h-48 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 relative z-10">
                <img 
                  src={f.img} 
                  alt={f.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col text-left justify-between py-1 relative z-10 grow">
                <div>
                  <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">{f.role}</span>
                  <h4 className="text-lg font-black text-slate-900 mt-1 leading-tight">{f.name}</h4>
                  <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider mt-1">{f.experience}</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mt-3">
                    "{f.bio}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. TOP CLINICAL DOCTORS LIST */}
      <div>
        <SectionHeading
          tag="Top Doctors"
          title="Meet Our Top Doctors & Board Specialists"
          description="Experienced clinical physicians coordinating your home consultations and bedside care checks."
          className="mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayDoctors.map((doc, idx) => (
            <div key={doc._id || idx} className="glass-card-premium !p-0 overflow-hidden flex flex-col h-full hover:border-teal-500/40 hover:shadow-xl transition-all duration-300 group rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="h-64 overflow-hidden relative w-full bg-slate-100 border-b border-slate-100">
                <img 
                  src={resolveImageUrl(doc.image || doc.img || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400')} 
                  alt={doc.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
                  }}
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-teal-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  {doc.experience || '5+ Years Exp'}
                </div>
              </div>
              <div className="p-6 text-left grow flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest block">
                    {doc.specialty || doc.speciality || 'General Medicine'}
                  </span>
                  <h4 className="text-base font-black text-slate-900 leading-tight">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold">
                    {doc.qualifications || doc.designation || 'MBBS'}
                  </p>
                  {doc.regNumber && (
                    <p className="text-[10px] text-teal-700 font-mono font-medium">
                      Reg: {doc.regNumber}
                    </p>
                  )}
                  {doc.bio && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-2 line-clamp-3 font-normal">
                      "{doc.bio}"
                    </p>
                  )}
                </div>

                {doc.availability && (
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{doc.availability}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </PageLayout>
  );
};

export default About;
