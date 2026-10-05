import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ArrowRight, Search, PhoneCall, MessageSquare, 
  ChevronRight, Activity, Stethoscope, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/url';

const POPULAR_SEARCH_TAGS = [
  "Doctor Visit", "ICU Setup", "Nursing Care", "Injection Service", 
  "Physiotherapy", "ECG at Home", "Wound Dressing", "Oxygen Cylinder"
];

const Navbar = ({ webSettings }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('preferred_language') || 'english');
  const searchInputRef = useRef(null);

  const toggleLang = () => {
    const nextLang = currentLang === 'english' ? 'telugu' : 'english';
    localStorage.setItem('preferred_language', nextLang);
    setCurrentLang(nextLang);
    window.dispatchEvent(new Event('languageChanged'));
  };

  useEffect(() => {
    const syncLang = () => {
      setCurrentLang(localStorage.getItem('preferred_language') || 'english');
    };
    window.addEventListener('languageChanged', syncLang);
    return () => window.removeEventListener('languageChanged', syncLang);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const isTe = currentLang === 'telugu';

  const baseLinks = isTe ? [
    { name: 'హోమ్', path: '/' },
    { name: 'సేవలు', path: '/services' },
    { name: 'వైద్యులు', path: '/about' },
    { name: 'మా గురించి', path: '/about-us' },
    { name: 'సంప్రదించండి', path: '/contact' },
  ] : [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/about' },
    { name: 'About', path: '/about-us' },
    { name: 'Contact', path: '/contact' },
  ];

  const navLinks = user ? [...baseLinks, { name: isTe ? 'అడ్మిన్' : 'Admin', path: '/admin' }] : baseLinks;

  const resolveLogoUrl = (logoUrl) => {
    if (!logoUrl) return '/logo.png';
    if (logoUrl.startsWith('/')) {
      if (logoUrl === '/logo.png') return '/logo.png';
      return resolveImageUrl(logoUrl);
    }
    return logoUrl;
  };

  const [logoSrc, setLogoSrc] = useState(resolveLogoUrl(webSettings?.logoUrl));

  useEffect(() => {
    if (webSettings?.logoUrl) {
      setLogoSrc(resolveLogoUrl(webSettings.logoUrl));
    }
  }, [webSettings?.logoUrl]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/services?search=${encodeURIComponent(tag)}`);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-2.5 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
        {/* Floating Glossy Glass Capsule */}
        <div className="max-w-5xl mx-auto glass-navbar-glossy rounded-full h-[52px] sm:h-[58px] px-3 sm:px-5 flex items-center justify-between gap-3 pointer-events-auto transition-all duration-300">
          
          {/* Left: Mobile Menu Trigger + Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-full text-slate-800 hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/90 p-1 flex items-center justify-center border border-slate-200/80 shadow-xs group-hover:scale-105 transition-transform">
                <img
                  src={logoSrc}
                  onError={() => setLogoSrc('/logo.png')}
                  alt={webSettings?.companyName || "Nest Cares"}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-[15px] font-black text-slate-900 tracking-tight leading-none">
                  {webSettings?.companyName || "Nest Cares"}
                </span>
                <span className="text-[8px] font-bold text-teal-700 uppercase tracking-wider leading-none mt-0.5">
                  Nizamabad
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Clean Minimalist Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60 backdrop-blur-xs">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Actions (Search, Palette, Language & Clean CTA) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Search Icon Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-black/5 transition-all cursor-pointer"
              title="Search Services"
              aria-label="Search Services"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-1 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-bold uppercase transition-all cursor-pointer border border-slate-200/60"
              title="Switch Language"
            >
              {isTe ? 'తెలుగు' : 'EN'}
            </button>

            {/* Helpline Dial (Desktop) */}
            <a
              href="tel:+919248849388"
              className="hidden md:flex p-2 rounded-full text-emerald-700 hover:bg-emerald-50 transition-all border border-emerald-200/60"
              title="Call Helpline: +91 92488 49388"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </a>

            {/* Glossy Pill CTA Button */}
            <Link
              to="/book"
              className="px-4 sm:px-5 py-2 bg-slate-950 hover:bg-black active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>{isTe ? 'బుకింగ్' : 'Book Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </Link>

          </div>

        </div>

        {/* Clean Spotlight Search Dropdown */}
        {searchOpen && (
          <div className="max-w-2xl mx-auto mt-2 glass-navbar-glossy rounded-3xl p-4 shadow-2xl animate-in slide-in-from-top-3 duration-200 pointer-events-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search services (e.g. Doctor, ICU, Nursing, Injections)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2.5 bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-bold uppercase rounded-full transition-all cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Quick chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Quick:</span>
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-[11px] font-medium transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden select-none">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Left slide-over panel */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300 border-r border-slate-200/80">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white p-1 flex items-center justify-center border border-slate-200">
                  <img src={logoSrc} alt="Nest Cares" className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Nest Cares</span>
                  <span className="text-[9px] font-bold text-teal-700 uppercase tracking-wider">Nizamabad</span>
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search In Drawer */}
            <div className="px-4 pt-3">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search home care services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </form>
            </div>

            {/* Drawer Menu Links */}
            <div className="p-4 space-y-1 flex-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-3">
                Navigation
              </div>

              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white font-extrabold shadow-sm'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}

              {/* Quick Highlight Cards */}
              <div className="pt-3 space-y-2">
                <Link
                  to="/services/icu-at-home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-all"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Activity className="w-4 h-4 text-rose-600" />
                    <span>ICU Setup at Home</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Ventilator & critical nurse</p>
                </Link>

                <Link
                  to="/services/nursing-care"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-all"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span>24/7 Nursing Care</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Bedside certified patient care</p>
                </Link>
              </div>
            </div>

            {/* Pinned Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
              
              {/* Language Switch */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Language</span>
                <button
                  onClick={toggleLang}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-900 text-[11px] font-bold uppercase cursor-pointer"
                >
                  🌐 {isTe ? 'తెలుగు' : 'English'}
                </button>
              </div>

              {/* Emergency Hotline */}
              <a
                href="tel:+919248849388"
                className="w-full py-2.5 px-4 rounded-full bg-slate-950 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call +91 92488 49388</span>
              </a>

              {/* WhatsApp Coordinator */}
              <a
                href="https://wa.me/919248849388"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Coordinator</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
