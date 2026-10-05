import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Stethoscope, UserCheck, MessageSquare, Calendar, Sparkles } from 'lucide-react';

const MobileBottomNav = ({ contactSettings }) => {
  const location = useLocation();
  const whatsapp = contactSettings?.whatsappNumber || "+91 92488 49388";
  const cleanWhatsapp = whatsapp.replace(/\D/g, '');

  const [currentLang, setCurrentLang] = React.useState(localStorage.getItem('preferred_language') || 'english');

  React.useEffect(() => {
    const syncLang = () => {
      setCurrentLang(localStorage.getItem('preferred_language') || 'english');
    };
    window.addEventListener('languageChanged', syncLang);
    return () => window.removeEventListener('languageChanged', syncLang);
  }, []);

  const isTe = currentLang === 'telugu';

  const navItems = [
    {
      name: isTe ? 'హోమ్' : 'Home',
      path: '/',
      icon: Home
    },
    {
      name: isTe ? 'సేవలు' : 'Services',
      path: '/services',
      icon: Stethoscope
    },
    {
      name: isTe ? 'వైద్యులు' : 'Doctors',
      path: '/about',
      icon: UserCheck
    }
  ];

  return (
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 max-w-md mx-auto z-50 md:hidden no-print select-none">
      <div className="glass-dock-luxury rounded-[1.75rem] p-1.5 flex items-center justify-between gap-1">

        {/* Navigation Tabs */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 h-12 rounded-[1.25rem] transition-all active:scale-95 ${
                isActive
                  ? 'bg-slate-950/[0.07] text-slate-950 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight truncate">{item.name}</span>
            </NavLink>
          );
        })}

        {/* WhatsApp Direct Chat */}
        <a
          href={`https://wa.me/${cleanWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 h-12 rounded-[1.25rem] text-emerald-600 font-bold transition-all active:scale-95"
          title="WhatsApp Support"
        >
          <MessageSquare className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] tracking-tight truncate">{isTe ? 'వాట్సాప్' : 'WhatsApp'}</span>
        </a>

        {/* Primary Booking Action */}
        <NavLink
          to="/book"
          className="btn-liquid-ink shrink-0 flex items-center gap-1.5 h-12 px-4 rounded-[1.25rem] font-bold text-[13px] transition-transform active:scale-95"
        >
          <Calendar className="w-4 h-4" />
          <span>{isTe ? 'బుకింగ్' : 'Book'}</span>
        </NavLink>

      </div>
    </div>
  );
};

export default MobileBottomNav;
