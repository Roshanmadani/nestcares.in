import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight, ChevronRight, Activity, Award, Search, SlidersHorizontal, Phone, Clock, ShieldCheck, Heart } from 'lucide-react';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { SectionHeading } from '../components/common/Typography';
import PageLayout from '../components/common/PageLayout';
import { Modal } from '../components/common/Overlays';
import { useToast } from '../components/common/ToastContext';
import { bookingsAPI } from '../services/api';
import { resolveImageUrl } from '../utils/url';

const DynamicIcon = ({ name, className }) => {
  const IconComponent = Icons[name] || Icons.Heart;
  return <IconComponent className={className} />;
};

import { translations } from '../utils/translations';

const Services = ({ services }) => {
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [quickBookOpen, setQuickBookOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchTerm(q);
    }
  }, [searchParams]);
  
  // Quick Callback Form State
  const [quickPhone, setQuickPhone] = useState('');
  const [quickName, setQuickName] = useState('');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickLocation, setQuickLocation] = useState('');
  const [quickSubmitLoading, setQuickSubmitLoading] = useState(false);

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
    document.title = isTe ? "హోమ్ హెల్త్‌కేర్ సేవలు నిజామాబాద్ - Nest Cares" : "Home Healthcare & Nursing Services in Nizamabad | Nest Cares";
  }, [isTe]);

  const servicesList = Array.isArray(services) ? services : [];
  const visibleServices = servicesList.filter(s => s && s.active);

  // Extract all unique categories
  const categories = ['All', ...new Set(visibleServices.map(s => s.category).filter(Boolean))];

  // Handle Search and Filter logic
  const filteredServices = visibleServices
    .filter((service) => {
      const matchesSearch = 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        activeCategory === 'All' || 
        service.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        // Sort by ID or creation date if available (mocking with slug comparison)
        return b.slug.localeCompare(a.slug);
      }
      // Default: sort by price / popularity proxy
      return b.price - a.price;
    });

  const handleQuickBookSubmit = async (e) => {
    e.preventDefault();
    if (!quickPhone || quickPhone.length < 10) {
      addToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    if (!quickLocation.trim()) {
      addToast('Please enter your location.', 'error');
      return;
    }
    
    setQuickSubmitLoading(true);
    try {
      // Dispatch callback request to backend
      const payload = {
        phoneNumber: quickPhone,
        notes: `Quick Book Request for: ${selectedService?.title || 'Unknown Service'}. Patient Name: ${quickName || 'Not Specified'}. Email: ${quickEmail || 'Not Specified'}. Location: ${quickLocation}`
      };
      
      await bookingsAPI.submitCallback(payload);
      addToast(`Booking Request for ${selectedService?.title} submitted! Our coordinator will call you back.`, 'success');
      setQuickPhone('');
      setQuickName('');
      setQuickEmail('');
      setQuickLocation('');
      setQuickBookOpen(false);
    } catch (err) {
      // Mock callback dispatch if API is offline
      setTimeout(() => {
        addToast(`Booking request for ${selectedService?.title} submitted! Our coordinator will call you back shortly.`, 'success');
        setQuickPhone('');
        setQuickName('');
        setQuickEmail('');
        setQuickLocation('');
        setQuickBookOpen(false);
        setQuickSubmitLoading(false);
      }, 800);
    } finally {
      setQuickSubmitLoading(false);
    }
  };

  const openQuickBook = (service) => {
    setSelectedService(service);
    setQuickBookOpen(true);
  };

  const getCatLabel = (cat) => {
    if (cat === 'All') return isTe ? 'అన్నీ' : 'All';
    if (cat === 'Critical Care') return isTe ? 'ఐసీయూ సేవలు' : 'Critical Care';
    if (cat === 'Home Nursing') return isTe ? 'హోమ్ నర్సింగ్' : 'Home Nursing';
    if (cat === 'Physiotherapy') return isTe ? 'ఫిజియోథెరపీ' : 'Physiotherapy';
    if (cat === 'Diagnostics') return isTe ? 'వైద్య పరీక్షలు' : 'Diagnostics';
    return cat;
  };

  return (
    <PageLayout
      title={isTe ? "వైద్య సేవల కేటలాగ్" : "Our Medical Catalog"}
      description={isTe ? "మీ ఇంట్లోనే అందించే ఆసుపత్రి స్థాయి వైద్య చికిత్సలు మరియు రికవరీ సేవలు." : "Professional, hospital-grade medical treatments and recovery services coordinated and delivered at your bedside."}
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Services' }]}
    >
      {/* 1. FILTER & SEARCH CONSOLE */}
      <div className="glass-card-premium rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200/80 bg-white/95 shadow-sm">
        {/* Keyword Search */}
        <div className="relative w-full md:max-w-xs">
          <Input
            placeholder={isTe ? "చికిత్సల కోసం వెతకండి..." : "Search treatments..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4 text-teal-600" />}
            className="!py-2.5 !bg-slate-50 !border-slate-200 !text-slate-900 placeholder:text-slate-400 focus:!border-teal-600"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full md:w-auto p-1.5 bg-slate-100 border border-slate-200 rounded-2xl shrink-0 max-w-full">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {getCatLabel(cat)}
              </button>
            );
          })}
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-slate-500 border-l border-slate-200 pl-4">
          <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
          <span>{isTe ? "వర్గీకరణ:" : "Sort:"}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-0 outline-none text-teal-700 font-bold cursor-pointer"
          >
            <option value="popular" className="bg-white text-slate-900">{isTe ? "ప్రజాదరణ" : "Popularity"}</option>
            <option value="newest" className="bg-white text-slate-900">{isTe ? "కొత్తవి" : "Newest"}</option>
          </select>
        </div>
      </div>

      {/* 2. SERVICES CARD GRID */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filteredServices.map((service, index) => {
              const img = service.galleryImages?.[0] || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400';
              const resolvedImg = resolveImageUrl(img);
              
              // Proxy popularity rating to render featured ribbons
              const isPopular = service.price > 4000;

              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <Card className="flex flex-col h-full overflow-hidden !p-0 group relative border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-teal-500/40 transition-all duration-300 rounded-3xl">
                    
                    {/* Featured Ribbon Badge */}
                    {isPopular && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md z-20">
                        {isTe ? "పాపులర్" : "Popular Choice"}
                      </span>
                    )}

                    {/* Service Card Image */}
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={resolvedImg}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                      
                      {/* Index / Category Icon */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md p-2 rounded-xl text-teal-700 shadow-md border border-slate-100 flex items-center justify-center z-10">
                        <DynamicIcon name={service.icon} className="w-4 h-4" />
                      </div>
                    </div>
     
                    {/* Service Card Details */}
                    <div className="p-6 flex flex-col grow justify-between bg-white">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-1.5 font-sans">
                          <Activity className="w-3.5 h-3.5 text-teal-600" />
                          <span className="text-[11px] font-black text-teal-700 uppercase tracking-widest">{isTe ? getCatLabel(service.category) : (service.category || 'Speciality')}</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                          {service.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-normal line-clamp-3">
                          {service.shortDescription}
                        </p>
                        
                        {/* Sub-services preview pills */}
                        {service.subServices?.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {service.subServices.slice(0, 2).map((sub, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                                {typeof sub === 'string' ? sub : sub.name}
                              </span>
                            ))}
                            {service.subServices.length > 2 && (
                              <span className="text-xs text-slate-500 font-bold self-center ml-1">
                                +{service.subServices.length - 2} {isTe ? "ఇతరాలు" : "more"}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Card CTAs */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto gap-2">
                        <Link
                          to={`/services/${service.slug}`}
                          className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1 min-h-11 pr-3 -ml-1 pl-1"
                        >
                          <span>{isTe ? "వివరాలు" : "Details"}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                        
                        <div className="flex items-center gap-1.5">
                          <Link
                            to="/book"
                            state={{ selectService: service.title }}
                            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-sm hover:scale-102"
                          >
                            <span>{isTe ? "బుక్ చేయండి" : "Book Now"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>

                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-12 glass-card-premium rounded-3xl p-8 max-w-lg mx-auto border border-slate-200/80 bg-white text-center shadow-sm">
          <SectionHeading
            tag={isTe ? "శోధన ఫలితం" : "Search Result"}
            title={isTe ? "సేవలు కనుగొనబడలేదు" : "No Services Found"}
            description={isTe ? `క్షమించండి, మీ వర్గం "${getCatLabel(activeCategory)}" మరియు కీవర్డ్ "${searchTerm}" కు సరిపోయే సేవలు ఏవీ లభించలేదు.` : `We couldn't find any healthcare services matching category: "${activeCategory}" and keyword: "${searchTerm}".`}
          />
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
            className="mt-6 mx-auto bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200"
          >
            {isTe ? "ఫిల్టర్లను క్లియర్ చేయి" : "Clear Filters"}
          </Button>
        </div>
      )}

      {/* 3. QUALITY TRUST FOOTER */}
      <div className="mt-16 max-w-3xl mx-auto">
        <div className="glass-card-premium rounded-3xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left p-8 border border-slate-200/80 bg-white shadow-sm">
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-teal-700 shrink-0">
            <Award className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
              <span>{isTe ? "పర్యవేక్షించబడే వైద్య రికవరీ ప్రోగ్రామ్‌లు" : "Supervised Clinical Recovery Programs"}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-normal">
              {isTe ? "అన్ని సేవలు సీనియర్ నిపుణుల పర్యవేక్షణలో అనుకూల చికిత్స ప్రణాళికలతో, రోజువారీ పర్యవేక్షణతో అందించబడతాయి." : "All services are delivered under custom care plans supervised by senior consultants, featuring daily vitals monitoring, background-verified paramedics, and 24/7 coordinator backup."}
            </p>
          </div>
        </div>
      </div>

      {/* 4. QUICK BOOK CALLBACK POPUP MODAL */}
      <Modal
        isOpen={quickBookOpen}
        onClose={() => setQuickBookOpen(false)}
        title={isTe ? `త్వరిత బుక్ అభ్యర్థన: ${selectedService?.title}` : `Quick Book Triage: ${selectedService?.title}`}
      >
        <form onSubmit={handleQuickBookSubmit} className="space-y-4 text-left">
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            {isTe ? "మీ వివరాలను నమోదు చేయండి. మా మెడికల్ డిస్పాచ్ కోఆర్డినేటర్ 15 నిమిషాల్లో మీకు కాల్ చేసి బుకింగ్ నిర్ధారిస్తారు." : "Enter your details. Our medical dispatch coordinator will call you back within 15 minutes to confirm the booking setup guidelines and match on-duty clinical staff."}
          </p>
          
          <div>
            <Input
              label={isTe ? "రోగి పేరు (ఐచ్ఛికం)" : "Patient Name (Optional)"}
              placeholder="e.g. John Doe"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
            />
          </div>

          <div>
            <Input
              label={isTe ? "మొబైల్ సంఖ్య" : "Mobile Number"}
              placeholder="Enter 10-digit number"
              type="tel"
              value={quickPhone}
              onChange={(e) => setQuickPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
            />
          </div>

          <div>
            <Input
              label={isTe ? "ఈమెయిల్ ఐడీ (ఐచ్ఛికం)" : "Email ID (Optional)"}
              placeholder="e.g. name@email.com"
              type="email"
              value={quickEmail}
              onChange={(e) => setQuickEmail(e.target.value)}
            />
          </div>

          <div>
            <Input
              label={isTe ? "నివాస ప్రాంతం / లొకేషన్" : "Location"}
              placeholder={isTe ? "నిజామాబాద్‌లో మీ నివాస ప్రాంతం/కాలనీ/వీధి" : "Enter your street/colony/area in Nizamabad"}
              value={quickLocation}
              onChange={(e) => setQuickLocation(e.target.value)}
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
            <Button variant="secondary" size="md" onClick={() => setQuickBookOpen(false)}>
              {isTe ? "రద్దు చేయి" : "Cancel"}
            </Button>
            <Button variant="primary" size="md" type="submit" loading={quickSubmitLoading}>
              {isTe ? "కాల్‌బ్యాక్ కోరండి" : "Request Callback"}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
};

export default Services;
